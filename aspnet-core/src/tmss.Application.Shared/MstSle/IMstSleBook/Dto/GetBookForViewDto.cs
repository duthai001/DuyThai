using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IMstSleBook.Dto
{
    public class GetBookForViewDto : EntityDto<long?>
    {
        public string NameBook { get; set; }
        public string AuthorName { get; set; }
        public decimal Price { get; set; }
        public string ImageData { get; set; }
    }
}
