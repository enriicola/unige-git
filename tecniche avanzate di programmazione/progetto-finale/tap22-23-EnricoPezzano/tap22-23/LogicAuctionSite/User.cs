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
    public class User : IUser{
        public string Username { get; set; }
        public string Password { get; set; }

        public int Id { get; set; }

        public string ConnectionString { get; set; }

        public Site site { get; set; }

        public User(string username, string password, int id, Site site, string connectionString) {
            if (username == null)
                throw new AuctionSiteArgumentNullException("username cannot be null");
            if (password == null)
                throw new AuctionSiteArgumentNullException("password cannot be null");
            if (password.Length < DomainConstraints.MinUserPassword)
                throw new AuctionSiteArgumentException("Value too short", nameof(password));
            if (id == null)
                throw new AuctionSiteArgumentNullException("id cannot be null");
            if (site == null)
                throw new AuctionSiteArgumentNullException("site cannot be null");
            if (connectionString == null)
                throw new AuctionSiteArgumentNullException("ConnectionString cannot be null");

            Username = username;
            Password = password;
            Id = id;
            ConnectionString = connectionString;
            this.site = site;
        }

        public void isDeleted() {
            using (var c = new AuctionSiteContext(ConnectionString!)) {
                try {
                    c.Users!.Single(s => s.UserId == Id);
                } catch (InvalidOperationException e) {
                    throw new AuctionSiteInvalidOperationException("the user has been deleted", e);
                }
            }
        }

        public void Delete() {
            site.isDeleted();
            isDeleted();
            var openAuction = site.ToyGetAuctions(true).Where(a => a.Seller.Username == Username || a.CurrentWinner().Username == Username);
            if (openAuction.Count() > 0)
                throw new AuctionSiteInvalidOperationException("you cannot delete an User who still has active actions on the site");
            using (var c = new AuctionSiteContext(ConnectionString!)) {
                try {
                    var user = c.Users.FirstOrDefault(u => u.UserId == Id);
                    var auctions = site.ToyGetAuctions(false).Where(s => s.Seller.Equals(this));
                    var sessions = site.ToyGetSessions().Where(s => s.User.Username == Username).ToList();

                    //c.Auctions.RemoveRange(auctions);
                    foreach (var auc in auctions)
                        auc.Delete();

                    foreach (var ses in sessions)
                        ses.Logout();

                    c.Users.Remove(user);
                
                    c.SaveChanges();
                } catch (SqlException e) {
                    throw new AuctionSiteUnavailableDbException("DB Error", e);
                }
            }
        }

        public override bool Equals(object? obj) {
            if (obj is null or not IUser) {
                return false;
            }

            return ((User)obj).Username == this.Username && ((User)obj).site.SiteId == this.site.SiteId;
        }

        public override int GetHashCode() {
            int hash = 17;
            hash *= (23 + Username.GetHashCode());
            return hash * (23 + site.SiteId.GetHashCode());
        }

        public IEnumerable<IAuction> WonAuctions() {
            site.isDeleted();
            isDeleted();
            List<AuctionData> wonauct;
            using (var c = new AuctionSiteContext(ConnectionString)) {
                wonauct = c.Auctions.Where(a => a.EndsOn < site.Now() &&  a.WinnerId == Id ).ToList();
                foreach (var auc in wonauct) {
                    var user = c.Users.FirstOrDefault(u => u.UserId == auc.WinnerId);
                    yield return new Auction(auc.AuctionId, new User(user.Username, user.Password, user.UserId, site, ConnectionString), auc.Description, auc.EndsOn, ConnectionString, site);
                }
            }
            
        }

       
    }
}
