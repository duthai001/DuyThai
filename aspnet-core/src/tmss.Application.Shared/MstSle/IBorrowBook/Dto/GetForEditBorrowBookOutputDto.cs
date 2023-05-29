using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class GetForEditBorrowBookOutputDto
    {
        public CreateOrEditBorrowBookDto BorrowBook { get; set; }
    }

    public class GetForEditReturnBookOutputDto
    {
        public CreateOrEditReturnBookDto ReturnBook { get; set; }
    }
}
