using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Role
{
    public class CreateRoleRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên vai trò")]
        public string Name { get; set; }
    }
}
