using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Supplier
{
    public class CreateSupplierRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên nhà cung cấp")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ nhà cung cấp")]
        public string Address { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ email nhà cung cấp")]
        //  [EmailAddress(ErrorMessage = "Vui lòng nhập đúng định dạng email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập số điện thoại nhà cung cấp")]
        // [Phone(ErrorMessage = "Vui lòng nhập đúng định dạng số điện thoại")]
        public string PhoneNumber { get; set; }
    }
}
