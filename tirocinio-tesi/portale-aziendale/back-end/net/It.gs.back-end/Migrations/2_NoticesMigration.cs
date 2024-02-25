namespace It.gs.backend.Migrations
{
    using FluentMigrator;
    using It.gs.backend.Model;

    [Migration(2)]
    public class NoticesMigration : Migration
    {

        public override void Down()
        {
  
        }

        public override void Up()
        {
            
            
            //Creation DB
            
            IfDatabase("sqlserver").Create.Schema("StarterDb");

            //Creation Notice table
            
            Create.Table("NoticeData")
                .WithColumn($"{nameof(NoticeData.NoticeId)}").AsInt32().PrimaryKey().Identity()
                .WithColumn($"{nameof(NoticeData.NoticeState)}").AsBoolean().NotNullable().WithDefaultValue(false)
                .WithColumn($"{nameof(NoticeData.NoticeDateTime)}").AsDateTime().NotNullable().WithDefaultValue(DateTime.Now)
                .WithColumn($"{nameof(NoticeData.NoticeTitle)}").AsString().NotNullable()
                .WithColumn($"{nameof(NoticeData.NoticeObject)}").AsString().NotNullable()
                .WithColumn($"{nameof(NoticeData.NoticeDesc)}").AsString().NotNullable()
                .WithColumn($"{nameof(NoticeData.UserId)}").AsString().Nullable();

            var noticeRows = new List<dynamic>
            {
                new { NoticeId = 1, NoticeState = false, NoticeDateTime = "01 gennaio 2023", NoticeTitle = "Allerta meteo", NoticeObject = "Pioggia pioggia pioggia", NoticeDesc = "Data l'allerta rossa su tutta Genova, l'ufficio resterà chiuso in data XXX.", UserId = "Utente 1" },
                new { NoticeId = 2, NoticeState = false, NoticeDateTime = "01 gennaio 2023", NoticeTitle = "Cambio orario d'ufficio", NoticeObject = "Si lavora solo in pausa pranzo", NoticeDesc = "Perchè si", UserId = "Utente 2" },
                new { NoticeId = 3, NoticeState = false, NoticeDateTime = "01 gennaio 2023", NoticeTitle = "Bullo ti ha rubato la prenotazione", NoticeObject = "Sei stato derubato delle tue certezze", NoticeDesc = "Sei stato spostato di posto", UserId = "Utente 3" },
                new { NoticeId = 4, NoticeState = false, NoticeDateTime = "01 gennaio 2023", NoticeTitle = "Riunione del XXX alle ore XX:XX", NoticeObject = "Invito alla riunione con Caio alle ore 15:00", NoticeDesc = "Sei stato invitato da Caio a partecipare alla riunione del XX", UserId = "Utente 4" },
                new { NoticeId = 5, NoticeState = false, NoticeDateTime = "01 gennaio 2023", NoticeTitle = "Richiesta di cambio posto", NoticeObject = "Tizio vorrebbe fare cambio di postazione con te", NoticeDesc = "Perchè lui ha più diritti di te", UserId = "Utente 5" }
            };

            foreach(var notice in noticeRows)
            {
                IfDatabase("sqlite").Insert.IntoTable("NoticeData").Row(notice);
                IfDatabase("sqlserver").Insert.IntoTable("NoticeData").Row(new { NoticeId = notice.NoticeId, NoticeState = notice.NoticeState, NoticeDateTime = notice.NoticeDateTime, NoticeTitle = notice.NoticeTitle, NoticeObject = notice.NoticeObject, NoticeDesc = notice.NoticeDesc, UserId = notice.UserId} );
            }
        }
    }
}
