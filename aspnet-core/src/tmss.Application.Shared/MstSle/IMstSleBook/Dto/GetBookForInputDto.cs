using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IMstSleBook.Dto
{
    public class GetBookForInputDto : PagedAndSortedResultRequestDto
    {
        public string BookName { get; set; }
    }
}
