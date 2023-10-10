using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Order
{
    public class CreateOrderClientRequest
    {
        public InfoRecipientRequest InfoRecipient { get; set; }
        public int PaymentMethodId { get; set; }
        public CreateOrderModel Order { get; set; }
        public string? Note { get; set; }
        public string? Onl_Amount { get; set; }
        public string? Onl_BankCode { get; set; }
        public string? Onl_OrderInfo { get; set; }
        public string? Onl_PayDate { get; set; }
        public string? Onl_TransactionStatus { get; set; }
        public string? Onl_SecureHash { get; set; }
        public string? Onl_TransactionNo { get; set; }
        public string? Onl_OrderId { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public int? Length { get; set; }
        public int? Width { get; set; }
    }
    public class InfoRecipientRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập họ và tên")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập email"), EmailAddress(ErrorMessage = "Vui lòng nhập đúng định dạng Email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ")]
        public string Address { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập phường")]

        public string WardCode { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập quận")]

        public int DistrictID { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thành phố")]
        public int ProvinceID { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số nhà/đường")]
        public string HouseNumberAndStreet { get; set; }
    }
    public class CreateOrderModel
    {
        [Required(ErrorMessage = "Vui lòng tổng tiền")]
        public double Total { get; set; }
        public List<CreateOrderDetailModel> ListProducts { get; set; }
        public string? Note { get; set; }


    }
    public class CreateOrderDetailModel
    {
        public int Id { get; set; }

        public int QuantityCart { get; set; }
        public int Quantity { get; set; }
        public string? FileName { get; set; }
        public string ProductName { get; set; }
        public double PriceOut { get; set; }
        public double? DiscountedPrice { get; set; }
        public int ProductId { get; set; }
        public CreateOrderDetailColorProductModel ColorProduct { get; set; }
        public CreateOrderDetailProductVersionModel ProductVersion { get; set; }


    }
    public class CreateOrderDetailColorProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CodeColor { get; set; }
    }
    public class CreateOrderDetailProductVersionModel
    {
        public CreateOrderDetailRamModel Ram { get; set; }
        public CreateOrderDetailRomModel Rom { get; set; }
    }
    public class CreateOrderDetailRamModel
    {
        public int Id { get; set; }
        public int Name { get; set; }
    }
    public class CreateOrderDetailRomModel
    {
        public int Id { get; set; }
        public int Name { get; set; }
    }
}
