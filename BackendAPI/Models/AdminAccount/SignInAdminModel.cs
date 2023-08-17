using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.AdminAccount
{
    public class SignInAdminModel
    {
        [Required(ErrorMessage = "Vui lòng email"), EmailAddress(ErrorMessage = "Vui lòng nhập đúng định dạng Email")]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}
