﻿using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class CreateOrEditBorrowBookDto : EntityDto<long?>
    {
        public int? ReaderId { get; set; }
        public DateTime? BorrowDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? Day { get; set; }
        public long? TotalLoanAmount { get; set; }
        public long? AmountBorrow { get; set; }
        public int? Status { get; set; }

        public List<CreateBorrowDetailDto> Details { get; set; }
    }

    public class CreateOrEditReturnBookDto : EntityDto<long?>
    {
        public int BorrowId { get; set; }
        public int ReaderId { get; set; }
        public long? TotalQuantity { get; set; }
        public DateTime ReturnBookDate { get; set; }

        public List<CreateReturnDetailDto> Details { get; set; }
    }
}
