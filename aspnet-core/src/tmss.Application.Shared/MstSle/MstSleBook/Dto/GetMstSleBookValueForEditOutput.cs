using System;
using System.Collections.Generic;
using System.Text;
using tmss.MstSle.Readerer.Dto;

namespace tmss.MstSle.MstSleBook.Dto
{
    public class GetMstSleBookValueForEditOutput
    {
        public CreateOrEditBookDto CreateOrEditBookValue{ get; set; }
    }

    public class GetMstSleOrderForEditOutput
    {
        public CreateOrEditOrderDto orderBook { get; set; }
    }
}
