using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("Punish")]
    public class Punish : FullAuditedEntity<long>, IEntity<long>
    {
        public int BorrowBookId { get; set; }
        public int ReaderId { get; set; }
        public int IsStatus { get; set; }
        public long? PunisnhMoney { get; set; }
    }
}
