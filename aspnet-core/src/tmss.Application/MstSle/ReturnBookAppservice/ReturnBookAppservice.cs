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
        private readonly IRepository<BorrowDetails, long> _borrowDetails;
        private readonly IRepository<Book, long> _book;
        private readonly IRepository<Punish, long> _punish;
        public ReturnBookAppService
            (IRepository<ReturnBook, long> returnBook,
            IRepository<Readers, long> readers,
            IRepository<BorrowBook, long> borrowBook,
            IRepository<ReturnBookDetails, long> returnBookDetails,
            IRepository<Book, long> book,   
            IRepository<BorrowDetails, long> borrowDetails,
            IRepository<Punish, long> punish)
        {
            _returnBook = returnBook;
            _readers = readers;
            _borrowBook = borrowBook;
            _returnBookDetails = returnBookDetails;
            _book = book;
            _borrowDetails = borrowDetails;
            _punish = punish;
        }

        public async Task<PagedResultDto<GetAllReturnBookForViewDto>> GetAll(GetReturnBookForInputDto input)
        {
            var query = from re in _returnBook.GetAll().AsNoTracking()
                        .Where(e => input.ReturnDateFrom == null || e.ReturnBookDate.Date >= input.ReturnDateFrom.Value.Date)
                        .Where(e => input.ReturnDateTo == null || e.ReturnBookDate.Date <= input.ReturnDateTo.Value.Date)
                        join reader in _readers.GetAll()
                        .Where(e => e.Name.Contains(input.Reader) || input.Reader == null)
                        on re.ReaderId equals reader.Id
                        select new GetAllReturnBookForViewDto
                        {
                            Id = re.Id,
                            ReaderName = reader.Name,
                            ReaderNo = reader.ReaderNo,
                            ReturnBookDate = re.ReturnBookDate.ToString("dd/MM/yyyy"),
                            Quantity = re.TotalQuantity,
                            ReturnNo=re.ReturnNo,
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
            var re = ObjectMapper.Map<ReturnBook>(input);
            int a = 1;
            re.ReturnNo = CreateReturnNo();
            var returnId = await _returnBook.InsertAndGetIdAsync(re);
            var reader = await _readers.FirstOrDefaultAsync(e => e.Id == input.ReaderId);
            reader.IsStatus = false;
            await _readers.UpdateAsync(reader);
            var borrow = await _borrowBook.FirstOrDefaultAsync(e => e.Id == input.BorrowId);
            if (borrow != null)
            {
                borrow.Status = a;
                await _borrowBook.UpdateAsync(borrow);
            }
            var money = 0;
            foreach (CreateReturnDetailDto detail in input.Details)
            {
                detail.ReturnBookId = (int)returnId;
                await CreateOrEditDetail(detail);
                var checkslmuon = _borrowDetails.FirstOrDefault(e => e.BorrowId == input.BorrowId && e.BookId==detail.BookId).Quantity;
                var bookmoney = _borrowDetails.FirstOrDefault(e => e.BookId == detail.BookId).Money;
                if (checkslmuon>detail.Quantity)
                {
                    money+= (checkslmuon -(int)detail.Quantity)*(int)bookmoney;
                }    
            }
            if(money !=0)
            {
                Punish ps= new Punish();
                ps.BorrowBookId = input.BorrowId;
                ps.ReaderId= input.ReaderId;
                ps.IsStatus = 1;
                ps.PunisnhMoney= money;
                ps.ReturnBookId= returnId;
                _punish.Insert(ps);
            }    
        }

        public async Task<GetForEditReturnBookOutputDto> GetForEdit(EntityDto<long> input)
        {
            var re = await _returnBook.FirstOrDefaultAsync(input.Id);

            var output = new GetForEditReturnBookOutputDto { ReturnBook = ObjectMapper.Map<CreateOrEditReturnBookDto>(re) };

            return output;
        }

        public async Task Update(CreateOrEditReturnBookDto input)
        {
            var re = await _returnBook.FirstOrDefaultAsync((long)input.Id);

            foreach (CreateReturnDetailDto detail in input.Details)
            {
                detail.ReturnBookId = (int)re.Id;
                await CreateOrEditDetail(detail);
            }

            ObjectMapper.Map(input, re);
        }

        public async Task Delete(long Id)
        {
            await _returnBook.DeleteAsync(Id);
        }
        #endregion

        #region Thêm - Sửa - Xóa chi tiết mượn sách
        public async Task CreateOrEditDetail(CreateReturnDetailDto input)
        {
            if (input.Id == 0)
            {
                await CreateDetail(input);
            }
           
        }

        public async Task CreateDetail(CreateReturnDetailDto input)
        {
            var checkQuantity = _book.FirstOrDefault(e => e.Id == input.BookId);
            var checkslmuon = _borrowDetails.FirstOrDefault(e => e.BookId == input.BookId);
            if(checkslmuon.Quantity<input.Quantity)
            {
                throw new UserFriendlyException("Số lượng sách trả lớn hơn số lượng sách mượn!");
            }
            var detail = ObjectMapper.Map<ReturnBookDetails>(input);
            detail.ReturnBookId = input.ReturnBookId;
            await _returnBookDetails.InsertAsync(detail);

            checkQuantity.Amuont = checkQuantity.Amuont + input.Quantity;
            await _book.UpdateAsync(checkQuantity);
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
            var count = _returnBook.GetAll().Count() + 1;
            DateTime currentDay = DateTime.Today;
            string now = currentDay.ToString("yyyyMMdd");
            string borrowNo = $"PT{now}{count}";
            return borrowNo;
        }

        public async Task<List<CreateReturnDetailDto>> GetListDetailByBorrow(long? borrowId)
        {
            var query = from borrowDetail in _borrowDetails.GetAll().AsNoTracking().Where(e => e.BorrowId == borrowId)

                        join book in _book.GetAll().AsNoTracking()
                        on borrowDetail.BookId equals book.Id

                        select new CreateReturnDetailDto()
                        {
                            BookId = book.Id,
                            Quantity = borrowDetail.Quantity,
                        };

            return await query.ToListAsync();
        }

        public async Task<PagedResultDto<GetListBorrowBookForReturnDto>> GetListBorrow(GetBorrowBookInputDto input)
        {
            var query = from borrow in _borrowBook.GetAll().AsNoTracking()
                        .Where(e => e.Status == 0)
                        .Where(e => input.BorrowDateFrom == null || e.BorrowDate.Date >= input.BorrowDateFrom.Value.Date)
                        .Where(e => input.BorrowDateTo == null || e.BorrowDate.Date <= input.BorrowDateTo.Value.Date)

                        join reader in _readers.GetAll()
                        .Where(e => e.Name.Contains(input.Reader) || input.Reader == null)
                        on borrow.ReaderId equals reader.Id

                        select new GetListBorrowBookForReturnDto
                        {
                            Id = borrow.Id,
                            BorrowId = borrow.Id,
                            Reader = reader.Name,
                            BorrowDate = borrow.BorrowDate.ToString("dd/MM/yyyy"),
                            DueDate = borrow.DueDate.ToString("dd/MM/yyyy"),
                            //Day = borrow.Day.ToString("dd/MM/yyyy"),
                            AmountBorrow = borrow.AmountBorrow,
                            TotalLoanAmount = borrow.TotalLoanAmount,
                            BorrowNo = borrow.BorrowNo,
                            ReaderId = reader.Id,
                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);

            return new PagedResultDto<GetListBorrowBookForReturnDto>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
            );
        }

        public async Task<List<ReturnBookDetails>> GetListDetailFromBorrow(long? borrowId)
        {
            var query = from borrow in _borrowBook.GetAll().AsNoTracking().Where(e => e.Status == 0 && e.Id == borrowId)

                        join brDetail in _borrowDetails.GetAll().AsNoTracking()
                        on borrow.Id equals brDetail.BorrowId

                        select new ReturnBookDetails()
                        {
                            BookId = brDetail.BookId,
                            Quantity = brDetail.Quantity,
                        };

            return await query.ToListAsync();
        }

        public async Task Siu(CreateReturnDetailDto input)
        {
            var re = ObjectMapper.Map<ReturnBookDetails>(input);
            await _returnBookDetails.InsertAsync(re);
            //re.ReturnNo = CreateReturnNo();
            //var returnId = await _returnBook.InsertAndGetIdAsync(re);
            //var reader = await _readers.FirstOrDefaultAsync(e => e.Id == input.ReaderId);
            //reader.IsStatus = false;
            //await _readers.UpdateAsync(reader);

            //foreach (CreateReturnDetailDto detail in input.Details)
            //{
            //    detail.ReturnBookId = (int)returnId;
            //    await CreateOrEditDetail(detail);
            //}
        }
    }
}
