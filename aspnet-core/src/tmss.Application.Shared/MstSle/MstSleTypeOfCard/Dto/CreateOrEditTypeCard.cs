using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.MstSleTypeOfCard.Dto
{
    public class CreateOrEditTypeCard : EntityDto<long?>
    {
        public string NameCard { get; set; }

        public long CardAmount { get; set; }

        public int Rate { get; set; }
    }
}
