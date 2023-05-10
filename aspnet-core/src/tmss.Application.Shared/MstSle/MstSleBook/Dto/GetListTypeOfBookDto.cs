using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.MstSleBook.Dto
{
    public class GetListTypeOfBookDto : EntityDto<long?>
    {
        public string BookTypeName { get; set; }
    }
}
