using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("Situation")]
    public class Situation : FullAuditedEntity<long>, IEntity<long>
    {
        public string PunishmentReason { get; set; }

    }
}
