using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Brand
{
    public class UpdateBrandRequest
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên thương hiệu")]
        public string Name { get; set; }
        public IFormFile? Image { get; set; }
    }
}
