using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("OrderBook")]
    public class OrderBook : FullAuditedEntity<long>, IEntity<long>
    {
        public long? BookId { get; set; }
        public int? Quantity { get; set; }
        public string Publishing { get; set; }
        public DateTime? Date { get; set; }
    }
}
