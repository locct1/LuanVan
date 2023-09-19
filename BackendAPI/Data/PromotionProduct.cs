using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    public class PromotionProduct
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Disabled { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<PromotionProductDetail>? PromotionProductDetails { get; set; }
    }
}
