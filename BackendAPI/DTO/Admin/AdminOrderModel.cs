using BackendAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTO.Admin
{
    public class AdminOrderModel
    {
        public int Id { get; set; }
        public double Total { get; set; }
        public string UserId { get; set; }
        public UserModel User { get; set; }
        public RecipentModel? Recipient { get; set; }
        public int? PaymentMethodId { get; set; }
        public PaymentMethodModel? PaymentMethod { get; set; }
        public int? OrderStatusId { get; set; }
        public OrderStatusModel? OrderStatus { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderDetailModel> OrderDetails { get; set; }
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
    public class OrderStatusModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class UserModel
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string WardCode { get; set; }
        public string HouseNumberAndStreet { get; set; }
        public int DistrictID { get; set; }
        public int ProvinceID { get; set; }
        public bool Disabled { get; set; }
    }
    public class RecipentModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? Address { get; set; }
    }
    public class PaymentMethodModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class OrderDetailModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FileName { get; set; }
        public int? OrderId { get; set; }
        public bool IsShockDeal { get; set; }
        public int ProductPurchaseOrderDetailId { get; set; }
        public ProductPurchaseOrderDetailModel ProductPurchaseOrderDetail { get; set; }
        public double PriceOut { get; set; }
    }
    public class ProductPurchaseOrderDetailModel
    {
        public int Id { get; set; }
        public int ProductSampleId { get; set; }
        public string Name { get; set; }
        public int StatusId { get; set; }
        public double PriceIn { get; set; }
        public int ProductPurchaseOrderId { get; set; }
    }
}
