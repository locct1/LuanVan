using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ReviewProduct
{
    public class CreateReviewProductRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập id Mẫu sản phẩm")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập id khách hàng")]
        public string UserId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập đánh giá sao")]
        public int Rating { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập cảm nhận của bạn")]
        public string CommentContent { get; set; }
        public List<IFormFile>? Images { get; set; }
    }
}
