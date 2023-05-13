using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("BorrowDetails")]
    public class BorrowDetails : FullAuditedEntity<long>, IEntity<long>
    {
        public int BorrowId { get; set; }
        public int BookId { get; set; }

        public int Quantity { get; set; }
        public long Money { get; set; }

    }
}
