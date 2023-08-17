using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Role
{
    public class UpdateRoleRequest
    {
        public string? Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên vai trò")]
        public string Name { get; set; }

    }
}
