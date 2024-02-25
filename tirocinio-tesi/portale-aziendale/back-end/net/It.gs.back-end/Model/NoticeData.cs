namespace It.gs.backend.Model
{
    using System.Text.Json.Serialization;
    using It.gs.Repository;
    using It.gs.Repository.Model;

    public class SendNoticeToUsersExecuteInfo : IExecuteInfo {
        public NoticeData[] Notices {get; set; }
    }

    public class DeleteNoticeDataExecuteInfo : IExecuteInfo {
        public NoticeData[] Notices {get; set; }
    }

    public class UpdateNoticeDataExecuteInfo : IExecuteInfo {
        public NoticeData[] Notices {get; set; }
    }

    [DbModel]
    public class NoticeData
    {
        [JsonPropertyName("noticeId")]
        public int NoticeId { get; set; }
        
        [JsonPropertyName("noticeState")]
        public bool NoticeState { get; set; }
        
        [JsonPropertyName("noticeDateTime")]
        public string NoticeDateTime { get; set; }        

        [JsonPropertyName("noticeTitle")]
        public string NoticeTitle { get; set; }

        [JsonPropertyName("noticeObject")]
        public string NoticeObject { get; set; }

        [JsonPropertyName("noticeDesc")]
        public string NoticeDesc { get; set; }

        [JsonPropertyName("userId")]
        public string UserId { get; set; }

        [JsonPropertyName("count")]
        public int? Count { get; set; }
    }
}
