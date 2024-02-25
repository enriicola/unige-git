namespace It.gs.backend.Requirements
{
    using System.Text.Json.Serialization;

    public class OAuthSettings
    {
        public string Authority { get; set; }
        public string Audience { get; set; }
        public string ClientId { get; set; }
        public RealmAccess RealmAccess { get; set; }
    }

    public class RealmAccess
    {
        [JsonPropertyName("roles")]
        public string[] Roles { get; set; }
    }
}
