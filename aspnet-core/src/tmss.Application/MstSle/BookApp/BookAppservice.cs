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
using Abp.UI;
using tmss.MstSle.IMstSleBook.Dto;

namespace tmss.MstSle.BookApp
{

    public class BookAppservice : tmssAppServiceBase, IApplicationService
    {
        private readonly IRepository<Book, long> _books;

        public BookAppservice(IRepository<Book, long> books)
        {
            _books = books;
        }
        public async Task<PagedResultDto<GetBookForViewDto>> GetAllBook(GetBookForInputDto input)
        {
            var query = from mstSleBook in _books.GetAll().AsNoTracking()
                        .Where(e => string.IsNullOrWhiteSpace(input.BookName) || e.NameBook.Contains(input.BookName))
                        select new GetBookForViewDto
                        {
                            Id = mstSleBook.Id,
                            NameBook = mstSleBook.NameBook,
                            AuthorName = mstSleBook.AuthorName,
                            Price = mstSleBook.Price,
                            ImageData = mstSleBook.ImageData

                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);
            return new PagedResultDto<GetBookForViewDto>(
              totalCount,
              await pagedAndFiltered.ToListAsync()
          );
        }

        public long? GetUser()
        {
            var x = (long?)AbpSession.UserId;
            return x;
        }

    }
}
