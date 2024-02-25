namespace It.gs.backend.Model
{
    using System.Text.Json.Serialization;
    using It.gs.Repository;
    using It.gs.Repository.Model;

    public class AddCoursesToDbExecuteInfo : IExecuteInfo {
        public CoursesData[] Courses {get; set; }
    }
    public class DeleteCoursesDataExecuteInfo : IExecuteInfo {
        public CoursesData[] Courses {get; set; }
    }
    public class UpdateCoursesDataExecuteInfo : IExecuteInfo {
        public CoursesData[] Courses {get; set; }
    }
    [DbModel]
    public class CoursesData
    {
        [JsonPropertyName("coursesId")]
        public int CoursesId { get; set; }

        [JsonPropertyName("coursesName")]
        public string CoursesName { get; set; }

        [JsonPropertyName("coursesCapacity")]
        public int CoursesCapacity { get; set; }

        [JsonPropertyName("coursesType")]
        public string CoursesType { get; set; }

        [JsonPropertyName("coursesDate")]
        public string CoursesDate { get; set; } // beginning date

        [JsonPropertyName("count")]
        public int? Count { get; set; }
    }
}

// [JsonPropertyName("courseDescription")]
// public string CoursesDescription { get; set; } // string nullable by default

// [JsonPropertyName("courseTags")]
// public string CoursesTags { get; set; } // key word for search, separated by -

// [JsonPropertyName("courseState")]
// public bool CoursesState { get; set; } // true = ongoing, false = ended

// [JsonPropertyName("courseLink")]
// public string CoursesLink { get; set; } // url to the course, example: https://www.udemy.com/course/the-complete-guide-to-angular-2/