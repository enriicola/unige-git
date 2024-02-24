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
    public class Session : ISession
    {
        public string Id { get; set; }

        public DateTime ValidUntil { get; set; }

        public IUser User { get; set; }

        public string ConnectionString { get; set; }

        public Site site { get; set; }

        public Session(string id, User user, Site site, DateTime validUntil, string connectionString) {
            if (id == null)
                throw new AuctionSiteArgumentNullException("id cannot be null");
            if (user == null)
                throw new AuctionSiteArgumentNullException("user cannot be null");
            if (validUntil == null)
                throw new AuctionSiteArgumentNullException("validuntil cannot be null");
            if (site == null)
                throw new AuctionSiteArgumentNullException("site cannot be null");
            if (connectionString == null)
                throw new AuctionSiteArgumentNullException("ConnectionString cannot be null");

            Id = id;
            User = user;
            this.site = site;
            ValidUntil = validUntil;
            ConnectionString = connectionString;
           
        }

        public void isExpired() {
            site.isDeleted();
            if (ValidUntil < site.Now())
                throw new AuctionSiteInvalidOperationException("session expired");
        }

        public void addTime() {
            using (var c = new AuctionSiteContext(ConnectionString)) {
                try {
                    var ses = c.Sessions.FirstOrDefault(s => s.SessionId == Id);
                     if (ses == null) 
                        throw new AuctionSiteInvalidOperationException("Session deleted");
                    ses.ValidUntil = site.Now().AddSeconds(site.SessionExpirationInSeconds);
                    this.ValidUntil = site.Now().AddSeconds(site.SessionExpirationInSeconds);
                
                    c.SaveChanges();
                } catch (SqlException e) {
                    throw new AuctionSiteUnavailableDbException("DB Error", e);
                }
            }
        }

        public IAuction CreateAuction(string description, DateTime endsOn, double startingPrice){
            isExpired();
            if (description == null)
                throw new AuctionSiteArgumentNullException("description cannot be null");
            if (description == "") 
                throw new AuctionSiteArgumentException("Cannot be empty", nameof(description));
            if (endsOn < site.Now()) 
                throw new AuctionSiteUnavailableTimeMachineException("Invalid endsOn");
            if (startingPrice < 0)
                throw new AuctionSiteArgumentOutOfRangeException(nameof(startingPrice),"starting price cannot be negative");
            
            using (var c = new AuctionSiteContext(ConnectionString)) {
                
                var auction = new AuctionData(description, endsOn, ((User)User).Id, startingPrice, site.SiteId);
                try {
                    c.Auctions.Add(auction);
                
                    c.SaveChanges();
                } catch (SqlException e) {
                    throw new AuctionSiteUnavailableDbException("DB Error", e);
                }
                addTime();
                return new Auction(auction.AuctionId,User,description, endsOn, ConnectionString, site);
            }
        }

        public void Logout(){
            using (var c = new AuctionSiteContext(ConnectionString)) {
                try {
                    ValidUntil = site.Now() - TimeSpan.FromSeconds(1);
                    var ses=c.Sessions.FirstOrDefault(s => s.SessionId == this.Id);
                    if (ses == null) 
                        throw new AuctionSiteInvalidOperationException("Session not exist");
                    c.Sessions.Remove(ses);
                
                    c.SaveChanges();
                } catch (SqlException e) {
                    throw new AuctionSiteUnavailableDbException("DB Error", e);
                }
            }
        }

        public override bool Equals(object? obj) {
            if (obj is null or not ISession)
                return false;

            return ((ISession)obj).Id == this.Id;
        }

        public override int GetHashCode() {
            return 23 * Id.GetHashCode();
        }
    }
}
