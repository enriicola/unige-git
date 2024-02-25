namespace It.gs.backend.Migrations
{
    using FluentMigrator;
    using It.gs.backend.Model;

    [Migration(5)] // Increment the db version, fifth migration
    public class BookingCoursesMigration : Migration
    {
        public override void Down(){}
        public override void Up()
        {
            //Creation DB
            IfDatabase("sqlserver").Create.Schema("StarterDb");

            //Creation Course table   
            Create.Table($"{nameof(BookingCoursesData)}")
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesId)}").AsInt32().PrimaryKey().Identity()
                .WithColumn($"{nameof(BookingCoursesData.BookingUserId)}").AsInt32().NotNullable()
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesName)}").AsBoolean().NotNullable().WithDefaultValue(false)
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesCapacity)}").AsInt16().NotNullable().WithDefaultValue(DateTime.Now)
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesType)}").AsString().NotNullable()
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesTags)}").AsString().NotNullable()
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesState)}").AsBoolean().NotNullable().WithDefaultValue(false)
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesLink)}").AsString().NotNullable()
                .WithColumn($"{nameof(BookingCoursesData.BookingCoursesDate)}").AsString().NotNullable();

            var bookingCoursesRows = new List<dynamic>
            {
                new { BookingCoursesId = 1, BookingUserId = 1234, BookingCoursesName = "Angular Modulo 1", BookingCoursesCapacity = 10, BookingCoursesType = "webinar", BookingCoursesTags = "Angular-Base", BookingCoursesState = false, BookingCoursesLink = "https://www.udemy.com/course/the-complete-guide-to-angular-2/#prenotation/123456789", BookingCoursesDate = "12-20-2023" },
                new { BookingCoursesId = 2, BookingUserId = 1234, BookingCoursesName = "Angular Modulo 2", BookingCoursesCapacity = 10, BookingCoursesType = "webinar", BookingCoursesTags = "Angular-Intermedio", BookingCoursesState = false, BookingCoursesLink = "https://www.udemy.com/course/the-complete-guide-to-angular-2/#prenotation/123456789", BookingCoursesDate = "12-20-2023" },
                new { BookingCoursesId = 3, BookingUserId = 1234, BookingCoursesName = "Angular Modulo 3", BookingCoursesCapacity = 10, BookingCoursesType = "webinar", BookingCoursesTags = "Angular-Intermedio-2", BookingCoursesState = false, BookingCoursesLink = "https://www.udemy.com/course/the-complete-guide-to-angular-2/#prenotation/123456789", BookingCoursesDate = "12-20-2023" },
                new { BookingCoursesId = 4, BookingUserId = 1234, BookingCoursesName = "Angular Modulo 4", BookingCoursesCapacity = 10, BookingCoursesType = "webinar", BookingCoursesTags = "Angular-Avanzato", BookingCoursesState = false, BookingCoursesLink = "https://www.udemy.com/course/the-complete-guide-to-angular-2/#prenotation/123456789", BookingCoursesDate = "12-20-2023" },
                new { BookingCoursesId = 5, BookingUserId = 1234, BookingCoursesName = "Angular Modulo 5", BookingCoursesCapacity = 10, BookingCoursesType = "webinar", BookingCoursesTags = "Angular-Master-Level", BookingCoursesState = false, BookingCoursesLink = "https://www.udemy.com/course/the-complete-guide-to-angular-2/#prenotation/123456789", BookingCoursesDate = "12-20-2023" }
            }; 
            
            foreach(var bookedCourse in bookingCoursesRows)
                Insert.IntoTable($"{nameof(BookingCoursesData)}").Row(bookedCourse);
        }
    }
}
