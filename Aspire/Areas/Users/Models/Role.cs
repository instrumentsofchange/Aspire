using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Aspire.Users.Models
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Role 
    {
        Admin = 0,
        Director = 1,
        Student = 2
    }
}
