using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.MstSleTypeOfCard.Dto
{
    public class GetTypeOfCardForInput : PagedAndSortedResultRequestDto
    {
        public string TypeCardName { get; set; }

    }
}
