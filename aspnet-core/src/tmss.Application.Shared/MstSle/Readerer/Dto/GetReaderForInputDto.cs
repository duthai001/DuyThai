using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.Readerer.Dto
{
    public class GetReaderForInputDto : PagedAndSortedResultRequestDto
    {
        public string NameReader { get; set; }
        public long ListTypeOfCardId { get; set; }

        public int IsStatus { get; set; }
    }
}
