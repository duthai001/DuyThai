using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.MstSleBook.Dto
{
    public class GetBookForInputDto: PagedAndSortedResultRequestDto
    {
        public string BookName { get; set; }
        public string Author { get; set; }

        public int TypeOfBookId { get; set; }
    }

    public class GetOrderForInputDto : PagedAndSortedResultRequestDto
    {
        public long? BookId { get; set; }
    }
}
