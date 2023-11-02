using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Order
{
    public class UpdateOrderRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập id đơn hàng")]
        public int OrderId { get; set; }
        public string? Onl_Amount { get; set; }
        public string? Onl_BankCode { get; set; }
        public string? Onl_OrderInfo { get; set; }
        public string? Onl_PayDate { get; set; }
        public string? Onl_TransactionStatus { get; set; }
        public string? Onl_SecureHash { get; set; }
        public string? Onl_TransactionNo { get; set; }
        public string? Onl_OrderId { get; set; }
    }
}
