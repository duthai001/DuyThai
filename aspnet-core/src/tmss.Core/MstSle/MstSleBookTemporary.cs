using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace tmss.MstSle
{
    [Table("MstSleBookTemporary")]
    public class MstSleBookTemporary : FullAuditedEntity<long>, IEntity<long>
    {
        public string TypeOfBook { get; set; }
        public string BookName { get; set; }
        public string Author { get; set; }
        public long? Amuont { get; set; }
        public long? Price { get; set; }
        public string Note { get; set; }
        public bool? IsLog { get; set; }
    }
}
