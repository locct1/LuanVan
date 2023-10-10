using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("Order")]

    public class Order
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public double Total { get; set; }
        public string? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }
        public int? RecipientId { get; set; }
        [ForeignKey(nameof(RecipientId))]
        public Recipient? Recipient { get; set; }
        public int? PaymentMethodId { get; set; }
        [ForeignKey(nameof(PaymentMethodId))]
        public PaymentMethod? PaymentMethod { get; set; }
        public int? OrderStatusId { get; set; }
        [ForeignKey(nameof(OrderStatusId))]
        public OrderStatus? OrderStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderDetail>? OrderDetails { get; set; }
        public string? Note { get; set; }
        public string? Onl_Amount { get; set; }
        public string? Onl_BankCode { get; set; }
        public string? Onl_OrderInfo { get; set; }
        public string? Onl_PayDate { get; set; }
        public string? Onl_TransactionStatus { get; set; }
        public string? Onl_SecureHash { get; set; }
        public string? Onl_TransactionNo { get; set; }
        public string? Onl_OrderId { get; set; }
        public string? WardCode { get; set; }
        public string? HouseNumberAndStreet { get; set; }
        public int? DistrictID { get; set; }
        public int? ProvinceID { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public int? Length { get; set; }
        public int? Width { get; set; }
        public string? OrderCode { get; set; }

    }
}
