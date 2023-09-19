using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BackendAPI.Data
{
    [Table("ProductVersion")]
    public class ProductVersion
    {
        [Key]
        public int Id { get; set; }
        public Product? Product { get; set; }
        [ForeignKey(nameof(ProductId))]
        public int? ProductId { get; set; }
        public Ram? Ram { get; set; }
        [ForeignKey(nameof(RamId))]
        public int? RamId { get; set; }
        public Rom? Rom { get; set; }
        [ForeignKey(nameof(RomId))]
        public int? RomId { get; set; }
        public double PriceIn { get; set; }
        public double PriceOut { get; set; }
        [JsonIgnore]
        public List<ProductSample>? ProductSamples { get; set; }
        public List<PromotionProductDetail>? PromotionProductDetails { get; set; }

    }
}
