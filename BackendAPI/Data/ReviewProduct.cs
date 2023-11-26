using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("ReviewProduct")]
    public class ReviewProduct
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string CommentContent { get; set; }
        public int Rating { get; set; }
        public int? ProductId { get; set; }
        [ForeignKey(nameof(ProductId))]
        public Product? Product { get; set; }
        public string? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }
        public bool IsPositive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<FeedbackReviewProduct>? FeedbackReviewProducts { get; set; }
        public List<LikeReviewProduct>? LikeReviewProducts { get; set; }
        public List<ReviewProductPhoto>? ReviewProductPhotos { get; set; }

    }
}
