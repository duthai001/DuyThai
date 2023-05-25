using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.Readerer.Dto
{
    public class GetReaderForViewDto : EntityDto<long?>
    {
        public string Name { get; set; }
        public string NameCard { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string ExpiredDayFrom { get; set; }
        public string ExpiredDayTo { get; set; }
        public string IsStatus { get; set; }
        public bool? isActive { get; set; }
    }
}
