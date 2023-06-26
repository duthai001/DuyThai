using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IReturnBookAppservice.Dto
{
    public class GetReturnBookForInputDto : PagedAndSortedResultRequestDto
    {
        public string Reader { get; set; }
        public DateTime? ReturnDateFrom { get; set; }
        public DateTime? ReturnDateTo { get; set; }
    }
}
