using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Pezzano;
using TAP22_23.AuctionSite.Interface;

namespace Pezzano
{
    public class UserData
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        [MinLength(DomainConstraints.MinUserName)]
        [MaxLength(DomainConstraints.MaxUserName)]
        public string Username { get; set; }
        [Required]
        [MinLength(DomainConstraints.MinUserPassword)]
        public string Password { get; set; } // hash password

        public List<SessionData> Sessions { get; set; }


        public int SiteId { get; set; }

        public SiteData? Site { get; set; }

        public List<AuctionData> Bidds { get; set; }

        public List<AuctionData> Sells { get; set; }

        public UserData(string username, string password, int siteId)
        {
            Username = username;
            Password = password;
            SiteId = siteId;
            Bidds = new();
            Sells = new();
            Sessions = new();
        }
    }
}
