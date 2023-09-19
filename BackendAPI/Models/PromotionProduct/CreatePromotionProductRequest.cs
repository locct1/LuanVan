using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.PromotionProduct
{
    public class CreatePromotionProductRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên khuyến mãi")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ngày bắt đầu")]

        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ngày kết thúc")]
        public DateTime EndDate { get; set; }
        public List<CreatePromotionProductDetailRequest> ListPromotionProducts { get; set; }
    }
    public class CreatePromotionProductDetailRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn phiên bản")]
        public int ProductVersionId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập giá khuyến mãi")]
        public double DiscountedPrice { get; set; }
    }
}
