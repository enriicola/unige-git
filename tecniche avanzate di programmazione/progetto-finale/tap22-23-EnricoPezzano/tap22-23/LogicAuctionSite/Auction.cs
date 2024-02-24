using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TAP22_23.AuctionSite.Interface;

namespace Pezzano
{
    public class Auction : IAuction{
        public int Id { get; set; }

        public IUser Seller { get; set; }

        public string Description { get; set; }

        public DateTime EndsOn { get; set; }

        public string ConnectionString { get; set; }

        public Site site { get; set; }

        public Auction(int id, IUser seller, string description, DateTime endOn, string connectionString, Site site) {
            if (id == null)
                throw new AuctionSiteArgumentNullException("id cannot be null");
            if (seller == null)
                throw new AuctionSiteArgumentNullException("seller cannot be null");
            if (description == null)
                throw new AuctionSiteArgumentNullException("description cannot be null");
            if (endOn == null)
                throw new AuctionSiteArgumentNullException("endOn cannot be null");
            if (connectionString == null)
                throw new AuctionSiteArgumentNullException("ConnectionString cannot be null");
            if (site == null)
                throw new AuctionSiteArgumentNullException("site cannot be null");
            Id = id;
            Seller = seller;
            Description = description;
            EndsOn = endOn;
            ConnectionString = connectionString;
            this.site = site;
        }

        private void isDeleted() {
            using (var c = new AuctionSiteContext(ConnectionString)) {
                var auction = c.Auctions.FirstOrDefault(a => a.AuctionId == Id);
                if(auction == null)
                    throw new AuctionSiteInvalidOperationException("Auction deleted");
            }
        }


        public bool Bid(ISession session, double offer)
        {
            if (session == null)
                throw new AuctionSiteArgumentNullException("session cannot be null");
            if (session.ValidUntil < site.Now())
                throw new AuctionSiteArgumentException("session expired");
            if (session.User.Username == Seller.Username)
                throw new AuctionSiteArgumentException("seller cannot make bids");
            if (((Session)session).site.SiteId != site.SiteId)
                throw new AuctionSiteArgumentException("session from a different site");
            if (offer < 0)
                throw new AuctionSiteArgumentOutOfRangeException("offer cannot be negative");
            isDeleted();
            using (var c = new AuctionSiteContext(ConnectionString)) {
                try {
                    var user = c.Users.FirstOrDefault(u => u.UserId == ((User)session.User).Id);

                    if (user == null)
                        throw new AuctionSiteInvalidOperationException("User deleted");
                
                    var auction = c.Auctions.FirstOrDefault(a => a.AuctionId == Id);

                    if (auction == null)
                        throw new AuctionSiteInvalidOperationException("Auction deleted");
                    ((Session)session).addTime();

                    if (offer < CurrentPrice())
                        return false;

                    if (auction.WinnerId == user.UserId) {
                        if (offer < auction.MaxBidValue + site.MinimumBidIncrement)
                            return false;
                        auction.MaxBidValue = offer;
                    } else if (auction.WinnerId == null) {
                        auction.MaxBidValue = offer;
                        auction.WinnerId = user.UserId;
                        auction.Winner = new UserData(user.Username, user.Password, user.UserId);

                    } else {
                        if (offer < CurrentPrice() + site.MinimumBidIncrement) 
                            return false;
                        if (auction.MaxBidValue < offer) {
                            if (offer < (auction.MaxBidValue + site.MinimumBidIncrement))
                                auction.CurrentValue = offer;
                            else
                                auction.CurrentValue = auction.MaxBidValue + site.MinimumBidIncrement;
                            auction.MaxBidValue = offer;
                            auction.WinnerId = user.UserId;
                            auction.Winner = new UserData(user.Username, user.Password, user.UserId);
                        } else {
                            if (auction.MaxBidValue < (offer + site.MinimumBidIncrement))
                                auction.CurrentValue = auction.MaxBidValue;
                            else
                                auction.CurrentValue = offer + site.MinimumBidIncrement;
                        }
                    }


                
                    c.SaveChanges();
                } catch (SqlException e) {
                    throw new AuctionSiteUnavailableDbException("DB Error", e);
                }
            }

            return true;


        }

        public override bool Equals(object? obj) {
            if (obj is null or not IAuction)
                return false;
            
            return ((IAuction)obj).Id == this.Id;
        }

        public override int GetHashCode() { 
            return 42 * Id.GetHashCode(); 
        }

        public double CurrentPrice()
        {
            isDeleted();
            using (var c = new AuctionSiteContext(ConnectionString)) {
                var price = c.Auctions.FirstOrDefault(a => a.AuctionId == Id)?.CurrentValue;
                return price ?? 0;
            }
        }

        public IUser CurrentWinner()
        {
            isDeleted();
            using (var c = new AuctionSiteContext(ConnectionString)) {
                /* var auc = c.Auctions.FirstOrDefault(a => a.AuctionId == Id);
                 var user = c.Users.FirstOrDefault(u => u.UserId == auc.WinnerId);*/
                var user = c.Auctions.Include(a => a.Winner).FirstOrDefault(a => a.AuctionId == Id)?.Winner;
                if (user == null)
                    return null;
                return new User(user.Username, user.Password, user.SiteId, site, ConnectionString);
            }
        }

        public void Delete()
        {
            isDeleted();
            using (var c = new AuctionSiteContext(ConnectionString)) {
                try {
                    var auction = c.Auctions.SingleOrDefault(a => a.AuctionId == Id);
                    if (auction != null) {
                        c.Remove(auction);

                        c.SaveChanges();
                    }
               } catch (SqlException e) {
                     throw new AuctionSiteUnavailableDbException("DB Error", e);
                    
                }
            }
        }
    }
}
