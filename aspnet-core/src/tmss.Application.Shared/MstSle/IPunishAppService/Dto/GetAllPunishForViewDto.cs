using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IPunishAppService.Dto
{
    public class GetAllPunishForViewDto : EntityDto<long?>
    {
        public string BorrowNo { get; set; }
        public string ReturnNo { get; set; }
        public string Reader { get; set; }
        public string ReaderNo { get; set; }
        public string Status { get; set; }
        public long? PunisnhMoney { get; set; }
    }
}
