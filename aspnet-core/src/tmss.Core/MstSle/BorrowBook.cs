using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("BorrowBook")]
    public class BorrowBook : FullAuditedEntity<long>, IEntity<long>
    {
        public int RedearId { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime Day { get; set; }
        public long TotalLoanAmount { get; set; }

        public long AmountBorrow { get; set; }

        public int Status { get; set; }
    }
}
