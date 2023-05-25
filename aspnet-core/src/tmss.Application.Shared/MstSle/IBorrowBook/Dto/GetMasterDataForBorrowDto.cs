using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class GetMasterDataForBorrowDto
    {
        public List<GetListBookForBorrowDto> ListBook { get; set; }
        public List<GetListBookPriceForBorrowDto> ListPrice { get; set; }
    }
}
