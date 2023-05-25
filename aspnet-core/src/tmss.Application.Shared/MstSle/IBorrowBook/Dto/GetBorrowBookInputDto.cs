using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class GetBorrowBookInputDto : PagedAndSortedResultRequestDto
    {
        public string filter { get; set; }
    }
}
