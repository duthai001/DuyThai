using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.Readerer.Dto
{
    public class GetReaderForExportDto : EntityDto<long>
    {
        public string Name { get; set; }
        public string CardType { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public string Status { get; set; }
    }
}
