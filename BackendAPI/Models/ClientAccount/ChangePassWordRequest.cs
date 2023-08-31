using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ClientAccount
{
    public class ChangePassWordRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu cũ")]

        public string OldPassWord { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu mới")]

        public string NewPassWord { get; set;}
    }
}
