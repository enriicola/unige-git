using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TAP22_23.AuctionSite.Interface;
using TAP22_23.AlarmClock.Interface;
using Microsoft.Data.SqlClient;

namespace Pezzano
{
    public class Host : IHost {

        private string ConnectionString { get; }
        private IAlarmClockFactory AlarmClockFactory { get; }


        public Host(string connectionString, IAlarmClockFactory alarmClockFactory){
            ConnectionString = connectionString;
            AlarmClockFactory = alarmClockFactory;
        }



        public void CreateSite(string name, int timezone, int sessionExpirationTimeInSeconds, double minimumBidIncrement){
            if(name == null)
                throw new AuctionSiteArgumentNullException("Site name cannot be null");
            if(name.Length < DomainConstraints.MinSiteName || name.Length > DomainConstraints.MaxSiteName)
                throw new AuctionSiteArgumentException("Site name Lenght not valid");
            if(timezone is < DomainConstraints.MinTimeZone or > DomainConstraints.MaxTimeZone)
                throw new AuctionSiteArgumentOutOfRangeException(nameof(timezone), timezone, "timezone value must be between -12 and 12");
            if(minimumBidIncrement < 0.01)
                throw new AuctionSiteArgumentOutOfRangeException(nameof(minimumBidIncrement), minimumBidIncrement, "minimumBitIncrement must be minimum 0.01");
            if(sessionExpirationTimeInSeconds < 1)
                throw new AuctionSiteArgumentOutOfRangeException(nameof(sessionExpirationTimeInSeconds), sessionExpirationTimeInSeconds, "sessionExpirationTimeInSeconds cannot be negative");

            var tmp = new SiteData(name, timezone, sessionExpirationTimeInSeconds, minimumBidIncrement);
            using (var c = new AuctionSiteContext(ConnectionString)){
                var openAuction = c.Sites.Where(a => a.Name == name ).ToList();
                if (openAuction.Count() > 0)
                    throw new AuctionSiteNameAlreadyInUseException(name, "Name of Site alredy used");
                try{
                    c.Sites.Add(tmp);
                    c.SaveChanges();
                }catch (AuctionSiteNameAlreadyInUseException e){
                    throw new AuctionSiteNameAlreadyInUseException(name, "Name of Site alredy used", e);
                }
            }


        }

        public IEnumerable<(string Name, int TimeZone)> GetSiteInfos(){
            using (var c = new AuctionSiteContext(ConnectionString)){
                List<SiteData> sites;
                try{
                    sites = c.Sites.ToList();
                }
                catch (SqlException e){
                    throw new AuctionSiteUnavailableDbException("Unexpected error", e);
                }
                foreach (var site in sites){
                    yield return (site.Name, site.Timezone);
                }

            }
        }

        public ISite LoadSite(string name){
            if (name == null)
                throw new AuctionSiteArgumentNullException("Site name cannot be null");
            if (name.Length < DomainConstraints.MinSiteName || name.Length > DomainConstraints.MaxSiteName)
                throw new AuctionSiteArgumentException("Site name Lenght not valid");
            using (var c = new AuctionSiteContext(ConnectionString)){
                try{
                    var tmp = c.Sites.FirstOrDefault(s => s.Name == name);
                    if (tmp == null)
                        throw new AuctionSiteInexistentNameException(nameof(name), "the site is not present in Database");
                    return new Site(tmp.SiteId, tmp.Name,tmp.Timezone,tmp.SessionExpirationInSeconds,tmp.MinimumBidIncrement, ConnectionString, AlarmClockFactory.InstantiateAlarmClock(tmp.Timezone));
                    
                }
                catch (SqlException e){
                    throw new AuctionSiteUnavailableDbException("Unexpected DB error", e);
                }
            }
        }
    }
}
