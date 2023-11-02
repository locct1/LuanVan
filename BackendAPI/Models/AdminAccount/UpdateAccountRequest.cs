using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.AdminAccount
{
    public class UpdateAccountRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập họ và tên")]
        public string FullName { get; set; }
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
        public List<string>? RoleNames { get; set; }

    }
}
