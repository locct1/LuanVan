using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.PromotionProduct
{
    public class UpdatePromotionProductRequest

    {
        [Required(ErrorMessage = "Vui lòng nhập id khuyến mãi")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên khuyến mãi")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ngày bắt đầu")]

        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ngày kết thúc")]
        public DateTime EndDate { get; set; }
        public List<UpdatePromotionProductDetailRequest> ListPromotionProducts { get; set; }
        public class UpdatePromotionProductDetailRequest
        {
            [Required(ErrorMessage = "Vui lòng chọn phiên bản")]
            public int ProductVersionId { get; set; }
            [Required(ErrorMessage = "Vui lòng nhập giá khuyến mãi")]
            public double DiscountedPrice { get; set; }
        }
    }
}
