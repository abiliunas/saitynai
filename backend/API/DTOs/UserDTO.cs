using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDTO
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public List<string> UserRoles { get; set; }
    }
}