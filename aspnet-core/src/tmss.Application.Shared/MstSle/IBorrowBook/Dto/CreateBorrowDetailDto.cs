using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class CreateBorrowDetailDto : EntityDto<long?>
    {
        public int BorrowId { get; set; }
        public int BookId { get; set; }

        public int Quantity { get; set; }
        public long Money { get; set; }
        public long? SuggestedPrice { get; set; }
    }
}
