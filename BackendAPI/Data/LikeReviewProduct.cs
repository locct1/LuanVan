using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("LikeReviewProduct")]
    public class LikeReviewProduct
    {
        [Key]
        public int Id { get; set; }
        public int? ReviewProductId { get; set; }
        [ForeignKey(nameof(ReviewProductId))]
        public ReviewProduct? ReviewProduct { get; set; }
        public string? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
