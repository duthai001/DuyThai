using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.MstSleBook.Dto
{
    public class CreateOrEditBookDto : EntityDto<long?>
    {
        public int TypeOfBookId { get; set; }
        public string BookName { get; set; }
        public string Author { get; set; }
        public long Amuont { get; set; }
        public long Price { get; set; }
    }

    public class CreateOrEditOrderDto : EntityDto<long?>
    {
        public long? BookId { get; set; }
        public int? Quantity { get; set; }
        public string Publishing { get; set; }
        public DateTime? Date { get; set; }
    }
}
