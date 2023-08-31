using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ClientAccount
{
    public class SignInClientRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập email"), EmailAddress(ErrorMessage = "Vui lòng nhập đúng định dạng Email")]
        public string Email { get; set; } = null!;
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu")]
        public string Password { get; set; } = null!;
    }
}
