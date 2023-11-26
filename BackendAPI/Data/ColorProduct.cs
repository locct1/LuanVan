using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendAPI.Data
{
    [Table("ColorProduct")]
    public class ColorProduct
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string CodeColor { get; set; }
        [JsonIgnore]
        public List<ProductSample>? ProductSamples { get; set; }

    }
}
