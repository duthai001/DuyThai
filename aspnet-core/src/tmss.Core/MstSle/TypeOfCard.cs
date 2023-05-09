using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
    [Table("TypeOfCard")]
    public class TypeOfCard : FullAuditedEntity<long>, IEntity<long>
    {
        public const int MaxMaxNameCardLength = 255;
        [Required]
        [MaxLength(MaxMaxNameCardLength)]
        public string NameCard { get; set; }

        public long CardAmount { get; set; }

        public int Rate { get; set; }
    }
}
