using Abp.Application.Services.Dto;
using Abp.AspNetZeroCore.Net;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using GemBox.Spreadsheet;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using tmss.Dto;
using tmss.MstSle.Readerer.Dto;
using tmss.Storage;

namespace tmss.MstSle.Readerer
{
    public class MstSleReaderAppService : tmssAppServiceBase, IMstSleReaderAppService
    {

        private readonly IRepository<Readers, long> _reader;
        private readonly IRepository<TypeOfCard, long> _TypeOfCard;
        private readonly ITempFileCacheManager _tempFileCacheManager;

        public MstSleReaderAppService(IRepository<Readers, long> reader,
            IRepository<TypeOfCard, long> typeOfCard, ITempFileCacheManager tempFileCacheManager)
        {
            _reader = reader;
            _TypeOfCard = typeOfCard;
            _tempFileCacheManager = tempFileCacheManager;
        }
        public async Task<PagedResultDto<GetReaderForViewDto>> GetAllReader(GetReaderForInputDto input)
        {
            var _status = input.IsStatus == 1 ? false : true;
            var query = from reader in _reader.GetAll().AsNoTracking()
                       .Where(e => input.NameReader == null || e.Name.Contains(input.NameReader))
                       .Where(e => input.ListTypeOfCardId == -1 || input.ListTypeOfCardId == e.TypeId)
                       .Where(e => input.IsStatus == 0 || _status == e.IsStatus)
                        join type in _TypeOfCard.GetAll().AsNoTracking()
                        on reader.TypeId equals type.Id
                        into types
                        from type in types.DefaultIfEmpty()
                        select new GetReaderForViewDto
                        {
                            Id = reader.Id,
                            Name = reader.Name,
                            NameCard = type.NameCard,
                            PhoneNumber = reader.PhoneNumber,
                            Address = reader.Address,
                            ExpiredDayFrom = reader.ExpiredDayFrom.ToString("dd/MM/yyyy"),
                            ExpiredDayTo = reader.ExpiredDayTo.ToString("dd/MM/yyyy"),
                            IsStatus = reader.IsStatus == true ? "Đang mượn sách" : "Chưa mượn sách",
                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);

            return new PagedResultDto<GetReaderForViewDto>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
            );
        }
        public async Task CreateOrEditReader(CreateOrEditReaderDto input)
        {
            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }
        protected virtual async Task Create(CreateOrEditReaderDto input)
        {
            var mstSleReaderCount = _reader.GetAll().Where(e => e.Name == input.Name).Count();
            if (mstSleReaderCount >= 1)
            {
                throw new UserFriendlyException(00, L("Độc giả đã tồn tại"));
            }
            else
            {
                input.ExpiredDayTo = input.ExpiredDayTo.AddHours(7);
                input.ExpiredDayFrom = input.ExpiredDayFrom.AddHours(7);
                var mstSleReader = ObjectMapper.Map<Readers>(input);
                mstSleReader.IsStatus = false;
                await _reader.InsertAsync(mstSleReader);
            }
        }
        protected virtual async Task Update(CreateOrEditReaderDto input)
        {
            var mstSleReader = await _reader.FirstOrDefaultAsync((long)input.Id);
            input.ExpiredDayTo = input.ExpiredDayTo.AddHours(7);
            input.ExpiredDayFrom = input.ExpiredDayFrom.AddHours(7);
            ObjectMapper.Map(input, mstSleReader);
        }
        public async Task DeleteReader(EntityDto<long> input)
        {
            var result = await _reader.GetAll().FirstOrDefaultAsync(e => e.Id == input.Id);
            await _reader.DeleteAsync((long)result.Id);
        }
        public async Task<List<GetListTypeOfCardDto>> getTypeOfCard()
        {
            var list = from type in _TypeOfCard.GetAll().AsNoTracking().
                     Where(e => e.Id > 0)
                       select new GetListTypeOfCardDto
                       {
                           Id = type.Id,
                           CardName = type.NameCard,
                       };
            return await list.ToListAsync();
        }
        public async Task<GetMstSleReaderValueForEditOutput> GetMstSleReaderForEdit(EntityDto<long> input)
        {
            var MstSleReader = await _reader.FirstOrDefaultAsync(input.Id);

            var output = new GetMstSleReaderValueForEditOutput { CreateOrEdiReaderVlue = ObjectMapper.Map<CreateOrEditReaderDto>(MstSleReader) };

            return output;
        }

        #region Export
        public async Task<FileDto> ExportExcel(GetReaderForInputDto input)
        {
            var _status = input.IsStatus == 1 ? false : true;
            var query = (from reader in _reader.GetAll().AsNoTracking()
                       .Where(e => input.NameReader == null || e.Name.Contains(input.NameReader))
                       .Where(e => input.ListTypeOfCardId == -1 || input.ListTypeOfCardId == e.TypeId)
                       .Where(e => input.IsStatus == 0 || _status == e.IsStatus)
                        join type in _TypeOfCard.GetAll().AsNoTracking()
                        on reader.TypeId equals type.Id
                        into types
                        from type in types.DefaultIfEmpty()
                        select new GetReaderForExportDto
                        {
                            Id = reader.Id,
                            Name = reader.Name,
                            CardType = type.NameCard,
                            PhoneNumber = reader.PhoneNumber,
                            Address = reader.Address,
                            Start = reader.ExpiredDayFrom.ToString("dd/MM/yyyy HH:mm"),
                            End = reader.ExpiredDayTo.ToString("dd/MM/yyyy HH:mm"),
                            Status = reader.IsStatus == true ? "Đang mượn sách" : "Chưa mượn sách",
                        }).ToList();

            string fileName = $"ListReaders.xlsx";

            var file = new FileDto(fileName, MimeTypeNames.ApplicationVndOpenxmlformatsOfficedocumentSpreadsheetmlSheet);
            SpreadsheetInfo.SetLicense("FREE-LIMITED-KEY");

            // Path to File Template
            string p_template = "wwwroot/Excel";
            string path = "";
            path = Path.Combine(Directory.GetCurrentDirectory(), p_template, "Export_Readers.xlsx");

            var xlWorkBook = ExcelFile.Load(path);
            var v_worksheet = xlWorkBook.Worksheets[0];
            v_worksheet.Cells[$"B{1}"].Value = $"Ngày xuất: {DateTime.Now.ToString("dd/MM/yyyy")}";
            v_worksheet.Cells.GetSubrange($"A3:H{query.Count() + 3}").Style.Borders.SetBorders(MultipleBorders.All, SpreadsheetColor.FromName(ColorName.Green), LineStyle.Thin);
            for (var i = 1; i <= query.Count(); i++)
            {
                v_worksheet.Cells[$"A{i + 3}"].Value = i;
                v_worksheet.Cells[$"B{i + 3}"].Value = query[i - 1].Name;
                v_worksheet.Cells[$"C{i + 3}"].Value = query[i - 1].CardType;
                v_worksheet.Cells[$"D{i + 3}"].Value = query[i - 1].PhoneNumber;
                v_worksheet.Cells[$"E{i + 3}"].Value = query[i - 1].Address;
                v_worksheet.Cells[$"F{i + 3}"].Value = query[i - 1].Start;
                v_worksheet.Cells[$"G{i + 3}"].Value = query[i - 1].End;
                v_worksheet.Cells[$"H{i + 3}"].Value = query[i - 1].Status;
            }

            MemoryStream obj_stream = new MemoryStream();
            var tempFile = Path.Combine(Path.GetTempPath(), Guid.NewGuid() + $".xlsx");
            xlWorkBook.Save(tempFile);

            obj_stream = new MemoryStream(File.ReadAllBytes(tempFile));
            _tempFileCacheManager.SetFile(file.FileToken, obj_stream.ToArray());
            File.Delete(tempFile);
            obj_stream.Position = 0;
            return await Task.Run(() => file);
        }
        #endregion
    }
}
