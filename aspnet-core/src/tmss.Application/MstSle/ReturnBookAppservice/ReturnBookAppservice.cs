using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using tmss.MstSle.IBorrowBook.Dto;
using tmss.MstSle.IReturnBookAppservice.Dto;

namespace tmss.MstSle.ReturnBookAppService
{
    public class ReturnBookAppService : tmssAppServiceBase, IApplicationService
    {
        private readonly IRepository<ReturnBook, long> _returnBook;
        private readonly IRepository<ReturnBookDetails, long> _returnBookDetails;
        private readonly IRepository<Readers, long> _readers;
        private readonly IRepository<BorrowBook, long> _borrowBook;
        private readonly IRepository<Book, long> _book;
        public ReturnBookAppService
            (IRepository<ReturnBook, long> returnBook,
            IRepository<Readers, long> readers,
            IRepository<BorrowBook, long> borrowBook,
            IRepository<ReturnBookDetails, long> returnBookDetails, 
            IRepository<Book, long> book
            )
        {
            _returnBook = returnBook;
            _readers = readers;
            _borrowBook = borrowBook;
            _returnBookDetails = returnBookDetails;
            _book = book;
        }

        public async Task<PagedResultDto<GetAllReturnBookForViewDto>> GetAll(GetReturnBookForInputDto input)
        {
            var query = from re in _returnBook.GetAll().AsNoTracking()
                        .Where(e => input.BorrowDateFrom == null || e.ReturnBookDate.Date >= input.BorrowDateFrom.Value.Date)
                        .Where(e => input.BorrowDateTo == null || e.ReturnBookDate.Date <= input.BorrowDateTo.Value.Date)

                        join reader in _readers.GetAll()
                        .Where(e => e.Name == input.Reader || input.Reader == null)
                        on re.ReaderId equals reader.Id

                        select new GetAllReturnBookForViewDto
                        {
                            Id = re.Id,
                            ReaderName = reader.Name,
                            ReaderNo = reader.ReaderNo,
                            //ReturnNo = re.re,
                            ReturnBookDate = re.ReturnBookDate.ToString("dd/MM/yyyy"),
                            Quantity = re.TotalQuantity,
                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);

            return new PagedResultDto<GetAllReturnBookForViewDto>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
            );
        }

        public async Task<List<GetListReturnDetailByIdDto>> GetListDetail(long? returnId)
        {
            var query = from br in _returnBookDetails.GetAll().Where(e => e.ReturnBookId == returnId)

                        join book in _book.GetAll()
                        on br.BookId equals book.Id

                        select new GetListReturnDetailByIdDto
                        {
                            Id = br.Id,
                            Book = book.BookName,
                            Quantity = br.Quantity
                        };
            return await query.ToListAsync();
        }

        #region Thêm - Sửa - Xóa mượn sách
        public async Task CreateOrEdit(CreateOrEditReturnBookDto input)
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

        public async Task Create(CreateOrEditReturnBookDto input)
        {
            var re = ObjectMapper.Map<BorrowBook>(input);
            re.Status = 0;
            re.BorrowNo = CreateReturnNo();
            var returnId = await _borrowBook.InsertAndGetIdAsync(re);

            foreach (CreateReturnDetailDto detail in input.Details)
            {
                detail.ReturnBookId = (int)returnId;
                await CreateOrEditDetail(detail);
            }
        }

        public async Task<GetForEditReturnBookOutputDto> GetForEdit(EntityDto<long> input)
        {
            var re = await _borrowBook.FirstOrDefaultAsync(input.Id);

            var output = new GetForEditReturnBookOutputDto { ReturnBook = ObjectMapper.Map<CreateOrEditReturnBookDto>(re) };

            return output;
        }

        public async Task Update(CreateOrEditReturnBookDto input)
        {
            var re = await _borrowBook.FirstOrDefaultAsync((long)input.Id);

            foreach (CreateReturnDetailDto detail in input.Details)
            {
                detail.ReturnBookId = (int)re.Id;
                await CreateOrEditDetail(detail);
            }

            ObjectMapper.Map(input, re);
        }

        public async Task Delete(long Id)
        {
            await _borrowBook.DeleteAsync(Id);
        }
        #endregion

        #region Thêm - Sửa - Xóa chi tiết mượn sách
        public async Task CreateOrEditDetail(CreateReturnDetailDto input)
        {
            if (input.Id == null)
            {
                await CreateDetail(input);
            }
            else
            {
                await UpdateDetail(input);
            }
        }

        public async Task CreateDetail(CreateReturnDetailDto input)
        {
            var checkQuantity = _book.FirstOrDefault(e => e.Id == input.BookId);

            if (checkQuantity.Amuont < input.Quantity)
            {
                throw new UserFriendlyException("Số lượng sách mượn vượt quá số lượng sách hiện có!");
            }

            var detail = ObjectMapper.Map<ReturnBookDetails>(input);
            detail.ReturnBookId = input.ReturnBookId;
            await _returnBookDetails.InsertAsync(detail);

            checkQuantity.Amuont = checkQuantity.Amuont - input.Quantity;
            await _book.UpdateAsync(checkQuantity);
        }

        public async Task UpdateDetail(CreateReturnDetailDto input)
        {
            var detail = await _returnBookDetails.FirstOrDefaultAsync(e => e.Id == input.Id);

            var checkQuantity = _book.FirstOrDefault(e => e.Id == input.BookId);

            if (detail.Quantity > input.Quantity)
            {
                checkQuantity.Amuont = checkQuantity.Amuont + (detail.Quantity - input.Quantity);
            }
            if (detail.Quantity < input.Quantity)
            {
                checkQuantity.Amuont = checkQuantity.Amuont - (input.Quantity - detail.Quantity);
            }

            await _book.UpdateAsync(checkQuantity);

            ObjectMapper.Map(input, detail);
        }

        public async Task DeleteDetail(long DetailId)
        {
            await _returnBookDetails.DeleteAsync(DetailId);
        }

        public async Task<List<CreateReturnDetailDto>> GetDetailById(long? returnId)
        {
            var result = await (from re in _returnBookDetails.GetAll().Where(e => e.ReturnBookId == returnId)
                                select new CreateReturnDetailDto
                                {
                                    Id = re.Id,
                                    BookId = re.BookId,
                                    ReturnBookId = re.ReturnBookId,
                                    Quantity = re.Quantity
                                }).ToListAsync();
            return result;
        }
        #endregion

        #region Master Data Borrow Book
        public GetMasterDataForBorrowDto GetMasterData()
        {
            GetMasterDataForBorrowDto detail = new GetMasterDataForBorrowDto
            {
                ListBook = GetListBook(),
            };

            return detail;
        }

        #region Get List Book
        public List<GetListBookForBorrowDto> GetListBook()
        {
            var query = from b in _book.GetAll().AsNoTracking()

                        select new GetListBookForBorrowDto
                        {
                            Id = b.Id,
                            BookName = b.BookName,
                            BookId = b.Id
                        };
            return query.Distinct().ToList();
        }
        #endregion

        #region Get List Readers
        public async Task<List<GetListReaderForBorrowDto>> getListReaders()
        {
            var list = from r in _readers.GetAll().AsNoTracking()
                       select new GetListReaderForBorrowDto
                       {
                           Id = r.Id,
                           Name = r.Name,
                       };
            return await list.ToListAsync();
        }
        #endregion
        #endregion

        public string CreateReturnNo()
        {
            var count = _borrowBook.GetAll().Count() + 1;
            DateTime currentDay = DateTime.Today;
            string now = currentDay.ToString("yyyyMMdd");

            string borrowNo = $"PT{now}{count}";
            return borrowNo;
        }
    }
}
