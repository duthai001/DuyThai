using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IReturnBookAppservice.Dto
{
    public class GetAllReturnBookForViewDto : EntityDto<long?>
    {
        public string ReturnNo { get; set; }
        public string BorrowNo { get; set; }
        public string ReaderNo { get; set; }
        public string ReaderName { get; set; }
        public long? Quantity { get; set; }
        public string ReturnBookDate { get; set; }
    }
}
