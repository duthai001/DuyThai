﻿using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.MstSleTypeOfBook.Dto
{
    public class CreateOrEditTypeBook : EntityDto<long?>
    {
        public string BookTypeName { get; set; }
    }
}
