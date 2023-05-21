using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.EntityFrameworkCore.Uow;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using tmss.EntityFrameworkCore;
using tmss.MstSle.MstSleBook.Dto;
using Abp.Dapper.Repositories;
using Abp.UI;

namespace tmss.MstSle.MstSleBook
{
    public class MstsleBookAppservice:tmssAppServiceBase, IApplicationService
    {
        private readonly IRepository<Book, long> _books;
        private readonly IRepository<TypeOfBook, long> _typeOfBook;
        private readonly IRepository<OrderBook, long> _orderBook;
        private readonly IDapperRepository<Book, long> _dapperRepo;

        public MstsleBookAppservice(IRepository<Book, long> book,
            IRepository<TypeOfBook, long> typeOfBook,
            IDapperRepository<Book, long> dapperRepo
, IRepository<OrderBook, long> orderBook)
        {
            _books = book;
            _typeOfBook = typeOfBook;
            _dapperRepo = dapperRepo;
            _orderBook = orderBook;
        }

        #region Book
        public async Task<PagedResultDto<GetBookForViewDto>> GetAllBook(GetBookForInputDto input)
        {
            var query = from mstSleBook in _books.GetAll().AsNoTracking()
                           .Where(e => string.IsNullOrWhiteSpace(input.BookName) ||  e.BookName.Contains(input.BookName))
                             .Where(e => string.IsNullOrWhiteSpace(input.Author) || e.Author.Contains(input.Author))
                           .Where(e => input.TypeOfBookId == -1 || e.TypeOfBookId == input.TypeOfBookId)
                        join type in _typeOfBook.GetAll().AsNoTracking()
                        on mstSleBook.TypeOfBookId equals type.Id
                        into types
                        from type in types.DefaultIfEmpty()
                        select new GetBookForViewDto
                        {
                            Id = mstSleBook.Id,
                            BookTypeName = type.BookTypeName,
                            BookName = mstSleBook.BookName,
                            Author = mstSleBook.Author,
                            Amuont = mstSleBook.Amuont, 
                            Price = mstSleBook.Price,
           
                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);

            return new PagedResultDto<GetBookForViewDto>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
            );
        }
        public async  Task CreateOrEditBook(CreateOrEditBookDto input)
        {
            if(input.Id==null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }
        protected virtual async Task Create(CreateOrEditBookDto input)
        {
            var mstSlebook = ObjectMapper.Map<Book>(input);
            await _books.InsertAsync(mstSlebook);
        }
        protected virtual async Task Update(CreateOrEditBookDto input)
        {
            var mstSlebook = await _books.FirstOrDefaultAsync((long)input.Id);
            ObjectMapper.Map(input, mstSlebook);
        }
        public async Task DeleteBook(EntityDto<long> input)
        {
            var result= await _books.GetAll().FirstOrDefaultAsync(e=>e.Id==input.Id);
            await _books.DeleteAsync(result);
        }
        public async Task<List<GetListTypeOfBookDto>> getTypeOfBook()
        {
            var list = from type in _typeOfBook.GetAll().AsNoTracking().Where(e => e.Id > 0)
                       select new GetListTypeOfBookDto
                       {
                           Id = type.Id,
                           BookTypeName = type.BookTypeName,
                       };
            return await list.ToListAsync();
        }
        public async Task<GetMstSleBookValueForEditOutput> GetMstSleBookForEdit(EntityDto<long> input)
        {
            var mstSlebook= await _books.FirstOrDefaultAsync(input.Id);
            var output = new GetMstSleBookValueForEditOutput
            {
                CreateOrEditBookValue = ObjectMapper.Map<CreateOrEditBookDto>(mstSlebook)
            };
            return output;
        }
        public async Task<List<MstSleBookTemporary>> ValidateImportAndReturnData(ListMstSleBookTemporary input)
        {
            var tenantId = AbpSession.TenantId;
            var userId = AbpSession.UserId;
            await _dapperRepo.ExecuteAsync("DELETE FROM MstSleBookTemporary WHERE CreatorUserId = @CurrentUserId", new { CurrentUserId = userId });
            CurrentUnitOfWork.GetDbContext<tmssDbContext>().AddRange(input.listImportTemp);
            CurrentUnitOfWork.SaveChanges();
            await _dapperRepo.ExecuteAsync("EXEC ValidateMstSleBookTemporary @CurrentDealerId, @CurrentUserId", new { CurrentDealerId = tenantId, CurrentUserId = userId });
            IEnumerable<MstSleBookTemporary> result = await _dapperRepo.QueryAsync<MstSleBookTemporary>(@"
                SELECT BookName,TypeOfBook,Author,Amuont,Price,Note,IsLog FROM MstSleBookTemporary WHERE CreatorUserId = @CurrentUserId ORDER BY Id", new { CurrentUserId = userId });
            return result.ToList();
        }
        public async Task SaveDataToMainTable()
        {
            var tenantId = AbpSession.TenantId;
            var userId = AbpSession.UserId;
            await _dapperRepo.ExecuteAsync("EXEC Migrate_MstSleBooksTemporary @CurrentDealerId, @CurrentUserId", new { CurrentDealerId = tenantId, CurrentUserId = userId });
        }

        #endregion

        #region Order Book
        public async Task<PagedResultDto<GetOrderForViewDto>> GetAllOrder(GetOrderForInputDto input)
        {
            var query = from order in _orderBook.GetAll().AsNoTracking()
                           .Where(e => input.BookId == e.BookId)

                        select new GetOrderForViewDto
                        {
                            Id = order.Id,
                            Publishing = order.Publishing,
                            Quantity = order.Quantity,
                            Date = order.Date.Value.ToString("dd/MM/yyyy")
                        };

            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);

            return new PagedResultDto<GetOrderForViewDto>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
            );
        }
        public async Task CreateOrEditOrder(CreateOrEditOrderDto input)
        {
            if (input.Id == null)
            {
                await CreateOrder(input);
            }
            else
            {
                await UpdateOrder(input);
            }
        }
        protected virtual async Task CreateOrder(CreateOrEditOrderDto input)
        {
            if (input.Quantity <= 0)
            {
                throw new UserFriendlyException("Số lượng không được âm!");
            }

            var order = ObjectMapper.Map<OrderBook>(input);
            await _orderBook.InsertAsync(order);

            var book = await _books.FirstOrDefaultAsync(e => e.Id == input.BookId);
            book.Amuont = book.Amuont + (long)input.Quantity;
            await _books.UpdateAsync(book);
        }
        protected virtual async Task UpdateOrder(CreateOrEditOrderDto input)
        {
            if(input.Quantity <= 0)
            {
                throw new UserFriendlyException("Số lượng không được âm!");
            }    

            var mstSlebook = await _orderBook.FirstOrDefaultAsync((long)input.Id);
            ObjectMapper.Map(input, mstSlebook);

            var book = await _books.FirstOrDefaultAsync(e => e.Id == input.BookId);
            book.Amuont = book.Amuont + (long)input.Quantity;
            await _books.UpdateAsync(book);
        }
        public async Task DeleteOrder(EntityDto<long> input)
        {
            var result = await _orderBook.GetAll().FirstOrDefaultAsync(e => e.Id == input.Id);
            await _orderBook.DeleteAsync(result);
        }
        public async Task<GetMstSleOrderForEditOutput> GetOrderForEdit(EntityDto<long> input)
        {
            var mstSlebook = await _orderBook.FirstOrDefaultAsync(input.Id);
            var output = new GetMstSleOrderForEditOutput
            {
                orderBook = ObjectMapper.Map<CreateOrEditOrderDto>(mstSlebook)
            };
            return output;
        }
        //public async Task<List<MstSleBookTemporary>> ValidateImportAndReturnData(ListMstSleBookTemporary input)
        //{
        //    var tenantId = AbpSession.TenantId;
        //    var userId = AbpSession.UserId;
        //    await _dapperRepo.ExecuteAsync("DELETE FROM MstSleBookTemporary WHERE CreatorUserId = @CurrentUserId", new { CurrentUserId = userId });
        //    CurrentUnitOfWork.GetDbContext<tmssDbContext>().AddRange(input.listImportTemp);
        //    CurrentUnitOfWork.SaveChanges();
        //    await _dapperRepo.ExecuteAsync("EXEC ValidateMstSleBookTemporary @CurrentDealerId, @CurrentUserId", new { CurrentDealerId = tenantId, CurrentUserId = userId });
        //    IEnumerable<MstSleBookTemporary> result = await _dapperRepo.QueryAsync<MstSleBookTemporary>(@"
        //        SELECT BookName,TypeOfBook,Author,Amuont,Price,Note,IsLog FROM MstSleBookTemporary WHERE CreatorUserId = @CurrentUserId ORDER BY Id", new { CurrentUserId = userId });
        //    return result.ToList();
        //}
        //public async Task SaveDataToMainTable()
        //{
        //    var tenantId = AbpSession.TenantId;
        //    var userId = AbpSession.UserId;
        //    await _dapperRepo.ExecuteAsync("EXEC Migrate_MstSleBooksTemporary @CurrentDealerId, @CurrentUserId", new { CurrentDealerId = tenantId, CurrentUserId = userId });
        //}
        #endregion
    }
}
