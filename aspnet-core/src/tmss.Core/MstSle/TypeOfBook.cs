using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("TypeOfBook")]
    public class TypeOfBook : FullAuditedEntity<long>, IEntity<long>
    {
        public string BookTypeName { get; set; }

    }
}
