using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
   
    [Table("Reader")]
    public class Readers : FullAuditedEntity<long>, IEntity<long>
    {
        public const int MaxPhoneNumberLength = 15;
        public const int MaxNameLength = 255;

        public int TypeId { get; set; }

        [Required]
        [MaxLength(MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [MaxLength(MaxPhoneNumberLength)]
        public string PhoneNumber { get; set; }

        [MaxLength(MaxNameLength)]
        public string Address { get; set; }

        public DateTime ExpiredDayFrom { get; set; }

        public DateTime ExpiredDayTo { get; set; }

        public bool IsStatus { get; set; }
    }
}
