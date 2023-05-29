using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace tmss.MstSle.IBorrowBook.Dto
{
    public class GetListBorrowDetailByIdDto : EntityDto<long>
    {
        public string Book { get; set; }

        public int Quantity { get; set; }
        public long Money { get; set; }
    }
    public class GetListReturnDetailByIdDto : EntityDto<long>
    {
        public string Book { get; set; }

        public int Quantity { get; set; }
    }
}
