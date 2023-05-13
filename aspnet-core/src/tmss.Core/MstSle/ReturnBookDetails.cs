using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("ReturnBookDetails")]
    public class ReturnBookDetails : FullAuditedEntity<long>, IEntity<long>
    {
        public int ReturnBookId { get; set; }
        public int BookId { get; set; }
        public int Quantity { get; set; }
    }
}
