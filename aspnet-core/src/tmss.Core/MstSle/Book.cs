using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace tmss.MstSle
{
        [Table("Book")]
        public class Book : FullAuditedEntity<long>, IEntity<long>
        {
            public int TypeOfBookId { get; set; }
            public string BookName { get; set; }
            public string Author { get; set; }
            public long Amuont { get; set; }
            public long Price { get; set; }
        }
    
}
