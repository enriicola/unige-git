using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pezzano{
    public class AuctionData{
        [Key]
        public int AuctionId { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public DateTime EndsOn { get; set; }
        [Required]
        public UserData Seller { get; set; }
        [Required]
        public int SellerId { get; set; }
        [Required]
        public double CurrentValue { get; set; }

        public double MaxBidValue { get; set; }

        public UserData? Winner { get; set; }
        public int? WinnerId { get; set; }

        //public SiteData Site { get; set; }

        public int SiteId { get; set; }

        public AuctionData(string description, DateTime endsOn, int sellerId, double currentValue, int siteId)
        {
            Description = description;
            EndsOn = endsOn;
            SellerId = sellerId;
            SiteId = siteId;
            CurrentValue = currentValue;
            MaxBidValue = currentValue;
        }

    }
}
