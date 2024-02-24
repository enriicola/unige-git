using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using TAP22_23.AuctionSite.Interface;

namespace Pezzano {
    public class AuctionSiteContext : TapDbContext {

        public AuctionSiteContext(string connectionString) : base(new DbContextOptionsBuilder<AuctionSiteContext>().UseSqlServer(connectionString).Options) { }
        public DbSet<SiteData> Sites { get; set; }
        public DbSet<AuctionData> Auctions { get; set; }
        public DbSet<UserData> Users { get; set; }
        public DbSet<SessionData> Sessions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options) {
            //options.LogTo(Console.WriteLine).EnableSensitiveDataLogging();
            base.OnConfiguring(options);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            var auction = modelBuilder.Entity<AuctionData>();
            auction.HasOne(a => a.Seller).WithMany(u => u.Sells).OnDelete(DeleteBehavior.NoAction);
            auction.HasOne(a => a.Winner).WithMany(u => u.Bidds).OnDelete(DeleteBehavior.NoAction);

            var session = modelBuilder.Entity<SessionData>();
            session.HasOne(s => s.Site).WithMany(u => u.Sessions).OnDelete(DeleteBehavior.NoAction);

            var user = modelBuilder.Entity<UserData>();
            user.HasMany(s => s.Sessions).WithOne(u => u.User).OnDelete(DeleteBehavior.Cascade);
            base.OnModelCreating(modelBuilder);

        }

        public override int SaveChanges() {
            try {
                return base.SaveChanges();
            } catch (ArgumentException e) {
                throw new AuctionSiteUnavailableDbException("Database error", e);
            } catch (DbUpdateException e) {
                throw new AuctionSiteInvalidOperationException("Error on query", e);
            }
        }



    }
}
