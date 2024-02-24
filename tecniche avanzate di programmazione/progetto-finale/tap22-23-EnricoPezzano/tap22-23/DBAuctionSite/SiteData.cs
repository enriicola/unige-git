using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TAP22_23.AuctionSite.Interface;

namespace Pezzano{
    public class SiteData{

 

        [Key]
        public int SiteId { get; set; }
        [Required]
        [MaxLength(DomainConstraints.MaxSiteName)]
        [MinLength(DomainConstraints.MinSiteName)]
        public string? Name { get; set; }
        [Required]
        [Range(DomainConstraints.MinTimeZone, DomainConstraints.MaxTimeZone)]
        public int Timezone { get; set; }
        [Range(0, int.MaxValue)]
        public int SessionExpirationInSeconds { get; set; }
        [Range(0, double.MaxValue)]
        public double MinimumBidIncrement { get; set; }

        public List<UserData> Users { get; set; }
        public List<AuctionData> Auctions { get; set; }
        public List<SessionData> Sessions { get; set; }


        public SiteData(string name, int timezone, int sessionExpirationInSeconds, double minimumBidIncrement)
        {
            Name = name;
            Timezone = timezone;
            MinimumBidIncrement = minimumBidIncrement;
            SessionExpirationInSeconds = sessionExpirationInSeconds;
 

            Users = new();
            Auctions = new();
            Sessions = new();
        }
    }
}
