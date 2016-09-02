using Newtonsoft.Json;

namespace MVCReactTODO.Models
{
    public class Comment
    {
        [JsonProperty(PropertyName = "id")]
        public int Id { get; set; }

        [JsonProperty(PropertyName = "author")]
        public string Author { get; set; }

        [JsonProperty(PropertyName = "text")]
        public string Text { get; set; }
    }
}