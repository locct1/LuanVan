using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string FullName { get; set; }
        public string? Address { get; set; }
        public string? WardCode { get; set; }
        public string? HouseNumberAndStreet { get; set; }
        public int? DistrictID { get; set; }
        public int? ProvinceID { get; set; }
        public bool Disabled { get; set; }
        public List<ProductPurchaseOrder>? ProductPurchaseOrders { get; set; }
        public List<Order>? Orders { get; set; }
        public List<ReviewProduct>? ReviewProducts { get; set; }
        public List<FeedbackReviewProduct>? FeedbackReviewProducts { get; set; }
        public List<LikeReviewProduct>? LikeReviewProducts { get; set; }

    }
}
