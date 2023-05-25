using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.Readerer.Dto
{
    public class CreateOrEditReaderDto : EntityDto<long?>
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public DateTime ExpiredDayTo { get; set; }
        public DateTime ExpiredDayFrom { get; set; }
        public bool? IsStatus { get; set; }
        public bool? isActive { get; set; }
        public int? typeId { get; set; }
    }
}
