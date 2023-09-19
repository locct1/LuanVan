using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    public class PromotionProductDetail
    {
        [Key]
        public int Id { get; set; }
        public int? PromotionProductId { get; set; }
        [ForeignKey(nameof(PromotionProductId))]
        public PromotionProduct? PromotionProduct { get; set; }
        public int? ProductVersionId { get; set; }
        [ForeignKey(nameof(ProductVersionId))]
        public ProductVersion? ProductVersion { get; set; }
        public double DiscountedPrice { get; set; }
    }
}
