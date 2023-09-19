using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendAPI.Data
{
    [Table("Chip")]
    public class Chip
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ChipTypeId { get; set; }
        [ForeignKey(nameof(ChipTypeId))]
        public ChipType? ChipType { get; set; }
        [JsonIgnore]

        public List<Product>? Products { get; set; }
    }
}
