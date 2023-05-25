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
using tmss.MstSle.MstSleTypeOfBook.Dto;

namespace tmss.MstSle.MstSleTypeOfBook
{
    public class MstSleTypeOfBookAppService : tmssAppServiceBase,IApplicationService
    {
        private readonly IRepository<TypeOfBook, long> _typeBook;
        public MstSleTypeOfBookAppService(IRepository<TypeOfBook, long> typeBook)
        {
            _typeBook = typeBook;
        }
        public async Task<PagedResultDto<GetTypeOfBookForView>> GetAllTypeBook(GetTypeOfBookForInput input)
        {
            var query = from typeBook in _typeBook.GetAll().AsNoTracking()
                       .Where(e => string.IsNullOrWhiteSpace(input.TypeBookName) || e.BookTypeName.Contains(input.TypeBookName))
                        select new GetTypeOfBookForView
                        {
                            Id = typeBook.Id,
                            BookTypeName = typeBook.BookTypeName,
                        };
            var totalCount=await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);
            return new PagedResultDto<GetTypeOfBookForView>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
                );
        }
        public async Task CreateOrEditBookType(CreateOrEditTypeBook input)
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
        protected virtual async Task Create(CreateOrEditTypeBook input)
        {
            var mstSleTypeBook = ObjectMapper.Map<TypeOfBook>(input);
            await _typeBook.InsertAsync(mstSleTypeBook);
        }
        protected virtual async Task Update(CreateOrEditTypeBook input)
        {
            var mstSleTypeBook=await _typeBook.FirstOrDefaultAsync((long)input.Id);
            ObjectMapper.Map(input, mstSleTypeBook);
        }
        public async Task DeleteBookType(EntityDto<long> input)
        {
            var mstSleTypeBook= await _typeBook.FirstOrDefaultAsync(e=>e.Id==input.Id);
           await _typeBook.DeleteAsync(mstSleTypeBook);
        }
        public async Task<GetMstSleTypeBookValueForEditOutput> GetTypeBookForEdit(EntityDto<long> input)
        {
            var mstSleTypeBook = await _typeBook.FirstOrDefaultAsync(input.Id);
            var output = new GetMstSleTypeBookValueForEditOutput
            {
                CreateOrEditTypeBookValue = ObjectMapper.Map<CreateOrEditTypeBook>(mstSleTypeBook)
            };
            return output;
        }
    }
}
