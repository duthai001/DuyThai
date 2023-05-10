using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using tmss.MstSle.MstSleBook.Dto;
using tmss.MstSle.Readerer.Dto;

namespace tmss.MstSle.MstSleBook
{
    public class MstsleBookAppservice:tmssAppServiceBase, IMstSleBookAppService
    {
        private readonly IRepository<Book, long> _books;
        private readonly IRepository<TypeOfBook, long> _typeOfBook;

        public MstsleBookAppservice(IRepository<Book, long> book,
            IRepository<TypeOfBook, long> typeOfBook)
        {
            _books = book;
            _typeOfBook = typeOfBook;
        }
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
    }
  
        
}
