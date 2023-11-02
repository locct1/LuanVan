using BackendAPI.Models.PromotionProduct;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ShockDeal
{
    public class CreateShockDealRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên khuyến mãi")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ngày bắt đầu")]

        public DateTime StartDate { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập ngày kết thúc")]
        public DateTime EndDate { get; set; }
        public List<CreateMainProductRequest> ListMainProducts { get; set; }
        public List<CreateShockDealProductRequest> ListShockDealProducts { get; set; }
    }
    public class CreateMainProductRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn sản phẩm")]
        public int Id { get; set; }
    }
    public class CreateShockDealProductRequest
    {
        [Required(ErrorMessage = "Vui lòng chọn sản phẩm đi kèm")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập giá deal sốc")]
        public double ShockDealPrice { get; set; }
    }
}
