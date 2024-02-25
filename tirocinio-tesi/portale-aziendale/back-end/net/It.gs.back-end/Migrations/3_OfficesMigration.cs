namespace It.gs.backend.Migrations
{
    using FluentMigrator;
    using It.gs.backend.Model;

    [Migration(3)]
    public class OfficesMigration : Migration
    {

        public override void Down()
        {
  
        }

        public override void Up()
        {           
            //Creation Office Table
            
            Create.Table("OfficesData")
                .WithColumn($"{nameof(OfficesData.OfficesId)}").AsInt32().PrimaryKey().Identity()
                .WithColumn($"{nameof(OfficesData.OfficesName)}").AsString().NotNullable()
                .WithColumn($"{nameof(OfficesData.OfficesCapacity)}").AsInt16().NotNullable()
                .WithColumn($"{nameof(OfficesData.OfficesType)}").AsString().NotNullable()
                .WithColumn($"{nameof(OfficesData.UserId)}").AsString().Nullable();

            var officeRow = new List<dynamic>
            {
                new { OfficesId = 1, OfficesName = "Lisbona", OfficesCapacity = 4, OfficesType = "Ufficio standard" },
                new { OfficesId = 2, OfficesName = "Roma", OfficesCapacity = 5, OfficesType = "Sala riunioni" },
                new { OfficesId = 3, OfficesName = "Dublino", OfficesCapacity = 3, OfficesType = "Ufficio amministrativo" },
                new { OfficesId = 4, OfficesName = "Helsinki", OfficesCapacity = 6, OfficesType = "Ufficio dirigenti" },
                new { OfficesId = 5, OfficesName = "Praga", OfficesCapacity = 15, OfficesType = "Sala ristoro" }
            };


            foreach (var office in officeRow)
            {
                IfDatabase("sqlite").Insert.IntoTable("OfficesData").Row(office);
                IfDatabase("sqlserver").Insert.IntoTable("OfficesData").Row(new { OfficesId = office.OfficesId, OfficesName = office.OfficesName, OfficesCapacity = office.OfficesCapacity, office.OfficesType, UserId = (string)null} );
            }
        }
    }
}
