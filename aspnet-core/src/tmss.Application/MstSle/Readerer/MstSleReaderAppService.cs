using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using tmss.MstSle.Readerer;
using System.Threading.Tasks;
using tmss.MstSle.Readerer.Dto;
using Abp.Linq.Extensions;

namespace tmss.MstSle.Readerer
{
    public class MstSleReaderAppService : tmssAppServiceBase, IMstSleReaderAppService
    {

        private readonly IRepository<Readers, long> _reader;
         private readonly IRepository<TypeOfCard, long> _TypeOfCard;

        public MstSleReaderAppService(IRepository<Readers, long> reader,
            IRepository<TypeOfCard, long> typeOfCard)
        {
            _reader = reader;
            _TypeOfCard = typeOfCard;
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
                            ExpiredDayFrom = reader.ExpiredDayFrom.ToString("dd/MM/yyyy HH:mm"),
                            ExpiredDayTo = reader.ExpiredDayTo.ToString("dd/MM/yyyy HH:mm"),
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
                var mstSleReader = ObjectMapper.Map<Readers>(input);
                await _reader.InsertAsync(mstSleReader);
            }
        }
        protected virtual async Task Update(CreateOrEditReaderDto input)
        {
            var mstSleReader = await _reader.FirstOrDefaultAsync((long)input.Id);
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
    }
}
