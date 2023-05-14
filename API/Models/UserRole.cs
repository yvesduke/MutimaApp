using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class UserRole
    {
        public virtual User User { get; set; }
		public virtual Role Role { get; set; }
    }
}