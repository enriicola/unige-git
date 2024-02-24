using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TAP22_23.AlarmClock.Interface;
using TAP22_23.AuctionSite.Interface;

namespace Pezzano
{
    public class HostFactory : IHostFactory{
        public void CreateHost(string connectionString){
            if(connectionString == null)
                throw new AuctionSiteArgumentNullException($"{nameof(connectionString)} cannot be null");
            try{
                using (var c = new AuctionSiteContext(connectionString)){
                    c.Database.EnsureDeleted();
                    c.Database.EnsureCreated();
                }
            }
            catch (SqlException e){
                throw new AuctionSiteUnavailableDbException("DB Error", e);
            }
        }

        public IHost LoadHost(string connectionString, IAlarmClockFactory alarmClockFactory){
            if(connectionString == null || alarmClockFactory == null)
                throw new AuctionSiteArgumentNullException($"{nameof(connectionString)} or {nameof(alarmClockFactory)} cannot be null");
            using(var c = new AuctionSiteContext(connectionString)){
                if(!c.Database.CanConnect())
                    throw new AuctionSiteUnavailableDbException("can\'t connect to database");
            }
            return new Host(connectionString, alarmClockFactory);

        }
    }
}
