namespace It.gs.backend.Migrations
{
    using FluentMigrator;
    using It.gs.backend.Model;

    [Migration(4)] // Increment the db version, fourth migration
    public class CoursesMigration : Migration
    {
        public override void Down(){}
        public override void Up()
        {
            //Creation DB
            IfDatabase("sqlserver").Create.Schema("StarterDb");

            //Creation Course table
            Create.Table($"{nameof(CoursesData)}")
                .WithColumn($"{nameof(CoursesData.CoursesId)}").AsInt32().PrimaryKey().Identity()
                .WithColumn($"{nameof(CoursesData.CoursesName)}").AsBoolean().NotNullable().WithDefaultValue(false)
                .WithColumn($"{nameof(CoursesData.CoursesCapacity)}").AsInt16().NotNullable().WithDefaultValue(10)
                .WithColumn($"{nameof(CoursesData.CoursesType)}").AsString().NotNullable()
                .WithColumn($"{nameof(CoursesData.CoursesDate)}").AsString().NotNullable();

            var coursesRows = new List<dynamic>
            {
                new { CoursesId = 1, CoursesName = "Angular Modulo 1", CoursesCapacity = 10, CoursesType = "Udemy", CoursesDate = "30-01-2024" },
                new { CoursesId = 2, CoursesName = "Angular Modulo 2", CoursesCapacity = 10, CoursesType = "Udemy", CoursesDate = "30-02-2024" },
                new { CoursesId = 3, CoursesName = "Angular Modulo 3", CoursesCapacity = 10, CoursesType = "Udemy", CoursesDate = "30-03-2024" },
                new { CoursesId = 4, CoursesName = "Angular Modulo 4", CoursesCapacity = 10, CoursesType = "Udemy", CoursesDate = "30-04-2024" },
                new { CoursesId = 5, CoursesName = "Angular Modulo 5", CoursesCapacity = 10, CoursesType = "Udemy", CoursesDate = "30-05-2024" },
            }; 
            
            foreach(var course in coursesRows)
                Insert.IntoTable($"{nameof(CoursesData)}").Row(course);

            // Delete.Table($"{nameof(CoursesData)}");
        }
    }
}
