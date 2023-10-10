using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ReviewProduct
{
    public class CreateFeedBackReviewProductRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập id bình luận")]
        public int ReviewProductId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập nội dung phản hồi")]
        public string FeedBackContent { get; set; }
    }
}
