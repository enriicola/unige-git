namespace It.gs.backend.Model
{
    using System.Text.Json.Serialization;
    using It.gs.Repository;
    using It.gs.Repository.Model;

    public class AddOfficesToDbExecuteInfo : IExecuteInfo {
        public OfficesData[] Offices {get; set; }
    }
    public class DeleteOfficesDataExecuteInfo : IExecuteInfo {
        public OfficesData[] Offices {get; set; }
    }
    public class UpdateOfficesDataExecuteInfo : IExecuteInfo {
        public OfficesData[] Offices {get; set; }
    }
    [DbModel]
    public class OfficesData
    {
        [JsonPropertyName("officesId")]
        public int OfficesId { get; set; }

        [JsonPropertyName("officesName")]
        public string OfficesName { get; set; }

        [JsonPropertyName("officesCapacity")]
        public int OfficesCapacity { get; set; }

        [JsonPropertyName("officesType")]
        public string OfficesType { get; set; }

        [JsonPropertyName("userId")]
        public string UserId { get; set; }
        
        [JsonPropertyName("count")]
        public int? Count { get; set; }
    }
}
