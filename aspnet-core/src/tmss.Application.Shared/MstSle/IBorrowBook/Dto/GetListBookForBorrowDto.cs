using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class GetListBookForBorrowDto : EntityDto<long?>
    {
        public long? BookId { get; set; }
        public string BookName { get; set; }
    }

    public class GetListBookPriceForBorrowDto : EntityDto<long?>
    {
        public long? BookId { get; set; }
        public long? Price { get; set; }
    }

    public class GetListBookQuantityForBorrowDto : EntityDto<long?>
    {
        public long? BookId { get; set; }
        public long? Quantity { get; set; }
    }

    public class GetListReaderForBorrowDto : EntityDto<long?>
    {
        public string Name { get; set; }
    }
}
