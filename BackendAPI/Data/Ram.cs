using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendAPI.Data
{
    [Table("Ram")]
    public class Ram
    {
        [Key]
        public int Id { get; set; }
        public int Name { get; set; }
        [JsonIgnore]
        public List<ProductVersion>? ProductVersions { get; set; }

    }
}
