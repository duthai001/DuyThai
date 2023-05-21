using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.MstSleBook.Dto
{
    public class GetBookForViewDto : EntityDto<long?>
    {
        public string BookTypeName { get; set; }
        public string BookName { get; set; }
        public string Author { get; set; }
        public long Amuont { get; set; }
        public long Price { get; set; }
    }

    public class GetOrderForViewDto : EntityDto<long?>
    {
        public int? Quantity { get; set; }
        public string Publishing { get; set; }
        public string Date { get; set; }
    }
}
