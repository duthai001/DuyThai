using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using tmss.MstSle;
using tmss.MstSle.IBorrowBook.Dto;
using System.Linq;
using Abp.Linq.Extensions;
using Abp.Application.Services;
using Abp.UI;

namespace tmss.MstSle.BorrowBookApp
{
    public class BorrowBookAppService : tmssAppServiceBase, IApplicationService
    {
        private readonly IRepository<BorrowBook, long> _borrowBook;
        private readonly IRepository<BorrowDetails, long> _borrowDetails;
        private readonly IRepository<Readers, long> _readers;
        private readonly IRepository<Book, long> _book;
        private readonly IRepository<TypeOfCard, long> _typeOfCard;

        public BorrowBookAppService(
            IRepository<BorrowBook, long> borrowBook
, IRepository<Readers, long> readers, IRepository<BorrowDetails, long> borrowDetails, IRepository<Book, long> book, IRepository<TypeOfBook, long> typeOfBook, IRepository<TypeOfCard, long> typeOfCard)
        {
            _borrowBook = borrowBook;
            _readers = readers;
            _borrowDetails = borrowDetails;
            _book = book;
            _typeOfCard = typeOfCard;
        }

        public async Task<PagedResultDto<GetAllBorrowBookForViewDto>> GetAll(GetBorrowBookInputDto input)
        {
            var query = from borrow in _borrowBook.GetAll().AsNoTracking()

                        join reader in _readers.GetAll()
                        on borrow.ReaderId equals reader.Id

                        select new GetAllBorrowBookForViewDto
                        {
                            Id = borrow.Id,
                            Reader = reader.Name,
                            BorrowDate = borrow.BorrowDate.ToString("dd/MM/yyyy"),
                            DueDate = borrow.DueDate.ToString("dd/MM/yyyy"),
                            Day = borrow.Day.ToString("dd/MM/yyyy"),
                            AmountBorrow = borrow.AmountBorrow,
                            TotalLoanAmount = borrow.TotalLoanAmount,
                            Status = borrow.Status == 0 ? "Đang mượn" : borrow.Status == 1 ? "Đã trả" : "Đã quá hạn",
                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);

            return new PagedResultDto<GetAllBorrowBookForViewDto>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
            );
        }

        //Lấy danh sách bản ghi chi tiết mượn sách theo id mượn sách
        public async Task<List<GetListBorrowDetailByIdDto>> GetListDetail(long? borrowId)
        {
            var query = from br in _borrowDetails.GetAll().Where(e => e.BorrowId == borrowId)

                        join book in _book.GetAll()
                        on br.BookId equals book.Id

                        select new GetListBorrowDetailByIdDto
                        {
                            Id = br.Id,
                            Book = book.BookName,
                            Money = br.Money,
                            Quantity = br.Quantity
                        };
            return await query.ToListAsync();
        }

        #region Thêm - Sửa - Xóa mượn sách
        public async Task CreateOrEdit(CreateOrEditBorrowBookDto input)
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

        public async Task Create(CreateOrEditBorrowBookDto input)
        {
            var checkReader = _readers.FirstOrDefault(e => e.Id == input.ReaderId);
            if(checkReader.IsStatus != false)
            {
                throw new UserFriendlyException("Độc giả chưa trả sách, không thể cho mượn thêm!");
            }
            var typeId = _readers.FirstOrDefault(e => e.Id == input.ReaderId)?.TypeId;
            var totalPrice = _typeOfCard.FirstOrDefault(e => e.Id == typeId);
            {
                if(input.TotalLoanAmount > (totalPrice.CardAmount * (long)totalPrice.Rate) / 100)
                {
                    throw new UserFriendlyException("Tổng tiền sách mượn vượt quá số tiền tối đa loại thẻ được mượn!");
                }    
            }

            var borrow = ObjectMapper.Map<BorrowBook>(input);
            borrow.Status = 0;
            var borrowId = await _borrowBook.InsertAndGetIdAsync(borrow);

            checkReader.IsStatus = true;
            await _readers.UpdateAsync(checkReader);

            foreach(CreateBorrowDetailDto detail in input.Details)
            {
                detail.BorrowId = (int)borrowId;
                await CreateOrEditDetail(detail);
            }    
        }

        public async Task<GetForEditBorrowBookOutputDto> GetForEdit(EntityDto<long> input)
        {
            var borrow = await _borrowBook.FirstOrDefaultAsync(input.Id);

            var output = new GetForEditBorrowBookOutputDto { BorrowBook = ObjectMapper.Map<CreateOrEditBorrowBookDto>(borrow) };

            return output;
        }

        public async Task Update(CreateOrEditBorrowBookDto input)
        {
            var borrow = await _borrowBook.FirstOrDefaultAsync((long)input.Id);

            foreach(CreateBorrowDetailDto detail in input.Details)
            {
                detail.BorrowId = (int)borrow.Id;
                await CreateOrEditDetail(detail);
            }    

            ObjectMapper.Map(input, borrow);
        }

        public async Task Delete(long Id)
        {
            await _borrowBook.DeleteAsync(Id);
        }
        #endregion

        #region Thêm - Sửa - Xóa chi tiết mượn sách
        public async Task CreateOrEditDetail(CreateBorrowDetailDto input)
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

        public async Task CreateDetail(CreateBorrowDetailDto input)
        {
            var checkQuantity = _book.FirstOrDefault(e => e.Id == input.BookId);

            if(checkQuantity.Amuont < input.Quantity)
            {
                throw new UserFriendlyException("Số lượng sách mượn vượt quá số lượng sách hiện có!");
            }    

            var detail = ObjectMapper.Map<BorrowDetails>(input);
            detail.BorrowId = input.BorrowId;
            await _borrowDetails.InsertAsync(detail);

            checkQuantity.Amuont = checkQuantity.Amuont - input.Quantity;
            await _book.UpdateAsync(checkQuantity);
        }

        public async Task UpdateDetail(CreateBorrowDetailDto input)
        {
            var detail = await _borrowDetails.FirstOrDefaultAsync(e => e.Id == input.Id);

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
            await _borrowDetails.DeleteAsync(DetailId);
        }

        public async Task<List<CreateBorrowDetailDto>> GetDetailById(long? borrowId)
        {
            var result = await (from borrow in _borrowDetails.GetAll().Where(e => e.BorrowId == borrowId)
                                select new CreateBorrowDetailDto
                                {
                                    Id = borrow.Id,
                                    BookId = borrow.BookId,
                                    BorrowId = borrow.BorrowId,
                                    Money = borrow.Money,
                                    Quantity = borrow.Quantity
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
                ListPrice = GetListPrice().ToList(),
            };

            return detail;
        }

        #region Get List Price
        private IQueryable<GetListBookPriceForBorrowDto> GetListPrice()
        {
            var query = from b in _book.GetAll().AsNoTracking()

                        select new GetListBookPriceForBorrowDto
                        {
                            Id = b.Id,
                            BookId = b.Id,
                            Price = b.Price,
                        };
            return query;
        }
        #endregion

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
    }
}
