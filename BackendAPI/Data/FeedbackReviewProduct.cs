using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("FeedbackReviewProduct")]
    public class FeedbackReviewProduct
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string FeedBackContent { get; set; }
        public int? ReviewProductId { get; set; }
        [ForeignKey(nameof(ReviewProductId))]
        public ReviewProduct? ReviewProduct { get; set; }
        public string? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
