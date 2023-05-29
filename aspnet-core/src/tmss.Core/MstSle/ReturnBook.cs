using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("ReturnBook")]
    public class ReturnBook : FullAuditedEntity<long>, IEntity<long>
    {
        public int BorrowId { get; set; }
        public int ReaderId { get; set; }
        public long? TotalQuantity { get; set; }
        public DateTime ReturnBookDate { get; set; }
    }
}
