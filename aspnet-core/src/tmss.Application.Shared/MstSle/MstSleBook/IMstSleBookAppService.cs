using Abp.Application.Services;
using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using tmss.MstSle.MstSleBook.Dto;

namespace tmss.MstSle.MstSleBook
{
     public  interface  IMstSleBookAppService : IApplicationService
    {
        Task<PagedResultDto<GetBookForViewDto>> GetAllBook(GetBookForInputDto input);
      Task CreateOrEditBook(CreateOrEditBookDto input);
        Task DeleteBook(EntityDto<long> input);
        Task<List<GetListTypeOfBookDto>> getTypeOfBook();
        Task<GetMstSleBookValueForEditOutput> GetMstSleBookForEdit(EntityDto<long> input);
    }
}
