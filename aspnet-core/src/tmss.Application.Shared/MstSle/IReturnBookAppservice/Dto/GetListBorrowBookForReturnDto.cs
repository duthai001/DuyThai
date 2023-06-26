using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IReturnBookAppservice.Dto
{
    public class GetListBorrowBookForReturnDto : EntityDto<long>
    {
        public long BorrowId { get; set; }
        public long ReaderId { get; set; }
        public long? TotalQuantity { get; set; }
        public string BorrowNo { get; set; }
        public string Reader { get; set; }
        public long? TotalLoanAmount { get; set; }
        public long? AmountBorrow { get; set; }
        public string BorrowDate { get; set; }
        public string DueDate { get; set; }
    }
}
