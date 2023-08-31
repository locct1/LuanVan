using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.PaymentMethod
{
    public class CreatePaymentMethodRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên phương thức thanh toán")]
        public string Name { get; set; }
    }
}
