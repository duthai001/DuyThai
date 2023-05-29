using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class GetAllBorrowBookForViewDto : EntityDto<long?>
    {
        public string Reader { get; set; }
        public string BorrowDate { get; set; }
        public string DueDate { get; set; }
        public string Day { get; set; }
        public long? TotalLoanAmount { get; set; }
        public string BorrowNo { get; set; }
        public long? AmountBorrow { get; set; }

        public string Status { get; set; }
        public string ReaderNo { get; set; }
    }
}
