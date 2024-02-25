namespace It.gs.backend.Model
{
    using System.Text.Json.Serialization;
    using It.gs.Repository;
    using It.gs.Repository.Model;

    public class AddBookingCoursesToDbExecuteInfo : IExecuteInfo {
        public BookingCoursesData[] BookingCourses {get; set; }
    }
    public class DeleteBookingCoursesDataExecuteInfo : IExecuteInfo {
        public BookingCoursesData[] BookingCourses {get; set; }
    }
    public class UpdateBookingCoursesDataExecuteInfo : IExecuteInfo {
        public BookingCoursesData[] BookingCourses {get; set; }
    }
    [DbModel]
    public class BookingCoursesData
    {
        [JsonPropertyName("bookingCoursesId")]
        public int BookingCoursesId { get; set; }

        [JsonPropertyName("bookingUserId")]
        public int BookingUserId { get; set; }

        [JsonPropertyName("bookingCoursesName")]
        public string BookingCoursesName { get; set; }

        [JsonPropertyName("bookingCoursesCapacity")]
        public int BookingCoursesCapacity { get; set; }

        [JsonPropertyName("bookingCoursesType")]
        public string BookingCoursesType { get; set; } // online, offline, webinar, etc...
        
        [JsonPropertyName("bookingCount")]
        public int? BookingCount { get; set; }

        [JsonPropertyName("BookingCourseTags")]
        public string BookingCoursesTags { get; set; } // key word for search, separated by -

        [JsonPropertyName("bookingCourseState")]
        public bool BookingCoursesState { get; set; } // true = confirmed, false = not confirmed

        [JsonPropertyName("bookingCourseLink")]
        public string BookingCoursesLink { get; set; } // url to the course prenotation, example: https://www.udemy.com/course/the-complete-guide-to-angular-2/#prenotation/123456789

        [JsonPropertyName("BookingCoursesDate")]
        public string BookingCoursesDate { get; set; } // date of the prenotation, example: 2023-12-13
    }
}
