using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BackendAPI.Data
{
    [Table("JackPlug")]

    public class JackPlug
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string Name { get; set; }
        [JsonIgnore]

        public List<Product>? Products { get; set; }

    }
}
