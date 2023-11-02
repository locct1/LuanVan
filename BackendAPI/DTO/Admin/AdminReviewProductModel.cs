using BackendAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTO.Admin
{
    public class AdminReviewProductModel
    {
        public int Id { get; set; }
        public string CommentContent { get; set; }
        public int Rating { get; set; }
        public int? ProductId { get; set; }
        public ProductReviewProductModel? Product { get; set; }
        public string? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public UserModel? User { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<FeedbackReviewProductModel>? FeedbackReviewProducts { get; set; }
        public List<LikeReviewProductModel>? LikeReviewProducts { get; set; }
        public List<ReviewProductPhotoModel>? ReviewProductPhotos { get; set; }
    }
    public class ProductReviewProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class FeedbackReviewProductModel
    {
        public int Id { get; set; }
        public string FeedBackContent { get; set; }
        public int? ReviewProductId { get; set; }
        public string? UserId { get; set; }
        public UserModel? User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class LikeReviewProductModel
    {
        public int Id { get; set; }
        public int? ReviewProductId { get; set; }
        public string? UserId { get; set; }
        public UserModel? User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public class ReviewProductPhotoModel
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public int? ReviewProductId { get; set; }
    }
}
