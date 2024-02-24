using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TAP22_23.AuctionSite.Interface;
using TAP22_23.AlarmClock.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace Pezzano
{
    public class Site : ISite {
        public string Name { get; set; }

        public int Timezone { get; set; }

        public int SessionExpirationInSeconds { get; set; }

        public double MinimumBidIncrement { get; set; }

        public int SiteId { get; set; }

        public string ConnectionString { get; set; }
        public IAlarmClock AlarmClock { get; set; }

        public IAlarm Alarm { get; set; }

        public Site(int siteId, string name, int timezone, int sessionExpirationInSeconds, double minimumBidIncrement, string connectionString, IAlarmClock alarmClock) {
            if (name == null)
                throw new AuctionSiteArgumentNullException("Site name cannot be null");
            if (name.Length < DomainConstraints.MinSiteName || name.Length > DomainConstraints.MaxSiteName)
                throw new AuctionSiteArgumentException("Site name Lenght not valid");
            if (timezone is < DomainConstraints.MinTimeZone or > DomainConstraints.MaxTimeZone)
                throw new AuctionSiteArgumentOutOfRangeException(nameof(timezone), timezone, "timezone value must be between -12 and 12");
            if (minimumBidIncrement < 0.01)
                throw new AuctionSiteArgumentOutOfRangeException(nameof(minimumBidIncrement), minimumBidIncrement, "minimumBitIncrement must be minimum 0.01");
            if (sessionExpirationInSeconds < 1)
                throw new AuctionSiteArgumentOutOfRangeException(nameof(sessionExpirationInSeconds), sessionExpirationInSeconds, "sessionExpirationInSeconds cannot be negative");
            if (connectionString == null)
                throw new AuctionSiteArgumentNullException("ConnectionString cannot be null");
            if (alarmClock == null)
                throw new AuctionSiteUnavailableTimeMachineException("alarmClock not initialized");

            SiteId = siteId;
            Name = name;
            Timezone = timezone;
            SessionExpirationInSeconds = sessionExpirationInSeconds;
            MinimumBidIncrement = minimumBidIncrement;
            ConnectionString = connectionString;
            AlarmClock = alarmClock;
            Alarm = alarmClock.InstantiateAlarm(5 * 60 * 1000);
            Alarm.RingingEvent += () => {
                using (var c = new AuctionSiteContext(connectionString)) {
                    try {
                        var sessions = c.Sessions.Where(s => s.SiteId == SiteId && s.ValidUntil < Now()).ToList();
                        foreach (var ses in sessions)
                            c.Remove(ses);
                    
                        c.SaveChanges();
                    } catch (SqlException e) {
                        throw new AuctionSiteUnavailableDbException("DB Error", e);
                    }
                }
                 Alarm = alarmClock.InstantiateAlarm(5 * 60 * 1000);
            };


        }

        public bool isDeleted() {
            using (var c = new AuctionSiteContext(ConnectionString)) {
                
                var s= c.Sites.FirstOrDefault(s => s.SiteId == SiteId);
                return s == null;
               
            }
        }

        public void CreateUser(string username, string password) {
            if (username == null || password == null)
                throw new AuctionSiteArgumentNullException("Username or password cannot be null");
            if (username.Length < DomainConstraints.MinUserName || username.Length > DomainConstraints.MaxUserName)
                throw new AuctionSiteArgumentException("Username Lenght not valid");
            if (password.Length < DomainConstraints.MinUserPassword)
                throw new AuctionSiteArgumentException("Value too short", nameof(password));

            var tmp = new UserData(username, password, SiteId);
            using (var c = new AuctionSiteContext(ConnectionString)) {
                try {
                    var users = c.Users.Where(a => a.Username == username && a.SiteId == SiteId).ToList();
                    if (users.Count() > 0)
                        throw new AuctionSiteNameAlreadyInUseException("username alredy used");

                    if(isDeleted()) 
                        throw new AuctionSiteInvalidOperationException("Site has been deleted");
                    c.Users.Add(tmp);
                
                    c.SaveChanges();
                } catch (SqlException e) {
                    throw new AuctionSiteUnavailableDbException("DB Error", e);
                }
            }
        }

        public void Delete() {
            using (var c = new AuctionSiteContext(ConnectionString)) {
                //isDeleted(); // debug
                try {
                    var site = c.Sites.FirstOrDefault(s => s.SiteId == SiteId);
                    if (site == null)
                        throw new AuctionSiteInvalidOperationException("Site has been deleted");
                
                    var sessions = this.ToyGetSessions();
                    foreach (var ses in sessions)
                       ses.Logout();
                    var users = this.ToyGetUsers();
                    foreach (var us in users)
                        us.Delete();

                    c.Sites.Remove(site);
                
                    c.SaveChanges();
                } catch (SqlException e) {
                    throw new AuctionSiteUnavailableDbException("DB Error", e);
                }
            }
        }

        public ISession Login(string username, string password) {
            if (username == null || password == null)
                throw new AuctionSiteArgumentNullException("Username or password cannot be null");
            if (username.Length < DomainConstraints.MinUserName || username.Length > DomainConstraints.MaxUserName)
                throw new AuctionSiteArgumentException("Username Lenght not valid");

            using (var c = new AuctionSiteContext(ConnectionString)) {

                if (isDeleted())
                    throw new AuctionSiteInvalidOperationException("Site has been deleted");

                var user = c.Users.FirstOrDefault(u => u.Username == username && u.Password == password && u.SiteId == SiteId);
                if (user == null)
                    return null;

                var session = c.Sessions.FirstOrDefault(s => s.UserId == user.UserId && s.ValidUntil > Now());
                if (session == null) {
                    var sessionD = new SessionData($"ses{Name}{username}{Now() + TimeSpan.FromSeconds(SessionExpirationInSeconds)}", Now().AddSeconds(SessionExpirationInSeconds), user.UserId, SiteId);

                   
                    try {
                        c.Sessions.Add(sessionD);
                        c.SaveChanges();
                    } catch (SqlException e) {
                        throw new AuctionSiteUnavailableDbException("DB Error", e);
                    }

                    return new Session(sessionD.SessionId, new User(user.Username, user.Password, user.UserId, this, ConnectionString), this, sessionD.ValidUntil, ConnectionString);

                }
                return new Session(session.SessionId, new User(user.Username, user.Password, user.UserId, this, ConnectionString), this, session.ValidUntil, ConnectionString);
            }
            
        }

        public DateTime Now() {
            if (isDeleted())
                throw new AuctionSiteInvalidOperationException("Site has been deleted");
            return AlarmClock.Now;
        }


        //https://stackoverflow.com/questions/44465790/extended-method-on-sequence-doesnt-throw-exception-unless-i-use-tolist
        private IEnumerable<IUser> noLazyEvalueted_Users(List<UserData> users) {
            foreach (var user in users) {
                yield return new User(user.Username, user.Password, user.UserId, this, ConnectionString);
            }
        }


        public IEnumerable<IUser>? ToyGetUsers() {
            
            using (var c = new AuctionSiteContext(ConnectionString)) {
                if (isDeleted())
                    throw new AuctionSiteInvalidOperationException("Site has been deleted");
                var users = c.Users.Where(u => u.SiteId == SiteId).ToList();
                return noLazyEvalueted_Users(users);
                
            }
        }

        //https://stackoverflow.com/questions/44465790/extended-method-on-sequence-doesnt-throw-exception-unless-i-use-tolist
        private IEnumerable<IAuction> noLazyEvalueted_Auctions(List<AuctionData> auctions) {
            foreach (var auc in auctions) {
                var user = auc.Seller;
                yield return new Auction(auc.AuctionId, new User(user.Username, user.Password, user.UserId, this, ConnectionString), auc.Description, auc.EndsOn, ConnectionString, this);
            }
        }

        public IEnumerable<IAuction> ToyGetAuctions(bool onlyNotEnded) {

            
            List<AuctionData> auctions;
             using (var c = new AuctionSiteContext(ConnectionString)) {
                if (isDeleted())
                    throw new AuctionSiteInvalidOperationException("Site has been deleted");
                /*if (onlyNotEnded)
                    auction = c.Auctions.Where(a => a.SiteId == SiteId && a.EndsOn > Now()).ToList();
                else
                    auction = c.Auctions.Where(u => u.SiteId == SiteId).ToList();*/
                if (onlyNotEnded)
                      auctions = c.Auctions.Include(a => a.Seller).Where(a => a.SiteId == SiteId && a.EndsOn > Now()).ToList();
                 else
                      auctions = c.Auctions.Include(a => a.Seller).Where(a => a.SiteId == SiteId).ToList();
                 return noLazyEvalueted_Auctions(auctions);
              }
            
        }

        //https://stackoverflow.com/questions/44465790/extended-method-on-sequence-doesnt-throw-exception-unless-i-use-tolist
        private IEnumerable<ISession> noLazyEvalueted_Sessions(List<SessionData> sessions) {
            foreach (var ses in sessions) {
                var user = ses.User;
                yield return new Session(ses.SessionId, new User(user.Username, user.Password, user.UserId, this, ConnectionString), this, ses.ValidUntil, ConnectionString);
            }
        }



        public IEnumerable<ISession>? ToyGetSessions() {
            /* 
             List<SessionData>? session = new();
             using (var c = new AuctionSiteContext(ConnectionString)) {
                 var site = c.Sites.Single(s => s.SiteId == SiteId);
                 if(site == null) 
                     throw new AuctionSiteInvalidOperationException("Site has been deleted");
                 session = c.Sessions.Where(u => u.Site.SiteId == SiteId && u.ValidUntil > Now()).ToList();
             }

             foreach (var ses in session) {
                 var user = ses.User;
                 yield return new Session($"ses{SiteId}{user.Username}{Now() + TimeSpan.FromSeconds(SessionExpirationInSeconds)}", new User(user.Username, user.Password, user.UserId, this, ConnectionString), this, Now() + TimeSpan.FromSeconds(SessionExpirationInSeconds), ConnectionString);
             }
         }
            */

            
            using (var c = new AuctionSiteContext(ConnectionString)) {
                if (isDeleted())
                    throw new AuctionSiteInvalidOperationException("Site has been deleted");
                var sessions = c.Sessions.Include(s => s.User).Where(s => s.Site.Name == Name && s.ValidUntil > Now()).ToList();
                return noLazyEvalueted_Sessions(sessions);
            }


        }

    }
}
