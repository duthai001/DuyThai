using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.Readerer.Dto
{
    public class GetListTypeOfCardDto : EntityDto<long?>
    {
        public string CardName { get; set; }
    }
}
