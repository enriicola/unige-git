using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pezzano{
    public class SessionData{

        [Key]
        public string SessionId { get; set; }

        [Required]
        public DateTime ValidUntil { get; set; }

        public int UserId { get; set; }

        public UserData? User { get; set; }
        public int SiteId { get; set; }
        public SiteData? Site { get; set; }

        public SessionData(string sessionId, DateTime validUntil, int userId, int siteId)
        {
            SessionId = sessionId;
            ValidUntil = validUntil;
            UserId = userId;
            SiteId = siteId;
        }
    }
}
