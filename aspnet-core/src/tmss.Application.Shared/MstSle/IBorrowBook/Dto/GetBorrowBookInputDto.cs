using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class GetBorrowBookInputDto : PagedAndSortedResultRequestDto
    {
        public string Reader { get; set; }
        public DateTime? BorrowDateFrom { get; set; }
        public DateTime? BorrowDateTo { get; set; }
        public int? Status { get; set; }
    }
}
