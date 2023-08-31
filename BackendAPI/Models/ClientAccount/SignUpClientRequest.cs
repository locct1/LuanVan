using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ClientAccount
{
    public class SignUpClientRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập họ và tên")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập email"), EmailAddress(ErrorMessage = "Vui lòng nhập đúng định dạng Email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ")]
        public string FullAddress { get; set; }
        public bool Disabled { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Password { get; set; }
    }
}
