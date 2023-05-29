using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IReturnBookAppservice.Dto
{
    public class GetReturnBookForInputDto : PagedAndSortedResultRequestDto
    {
        public string Reader { get; set; }
        public DateTime? BorrowDateFrom { get; set; }
        public DateTime? BorrowDateTo { get; set; }
    }
}
