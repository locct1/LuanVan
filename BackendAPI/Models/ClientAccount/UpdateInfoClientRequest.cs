using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ClientAccount
{
    public class UpdateInfoClientRequest
    {
        public string FullName { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số điện thoại")]

        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ")]

        public string Address { get; set; }
    }
}
