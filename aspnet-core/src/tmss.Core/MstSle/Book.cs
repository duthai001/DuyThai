﻿using Abp.Domain.Entities.Auditing;
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
        public string NameBook { get; set; }
        public string AuthorName { get; set; }
        public decimal Price { get; set; }
        public string ImageData { get; set; }
    }
}
