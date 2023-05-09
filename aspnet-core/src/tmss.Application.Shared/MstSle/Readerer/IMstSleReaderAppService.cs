using Abp.Application.Services;
using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using tmss.MstSle.Readerer.Dto;

namespace tmss.MstSle.Readerer
{
   public interface IMstSleReaderAppService : IApplicationService
    {
        Task<PagedResultDto<GetReaderForViewDto>> GetAllReader(GetReaderForInputDto input);
        Task CreateOrEditReader(CreateOrEditReaderDto input);
        Task DeleteReader(EntityDto<long> input);
        Task<List<GetListTypeOfCardDto>> getTypeOfCard();
        Task<GetMstSleReaderValueForEditOutput> GetMstSleReaderForEdit(EntityDto<long> input);
    }
}
