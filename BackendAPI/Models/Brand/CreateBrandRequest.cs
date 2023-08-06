using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Brand
{
    public class CreateBrandRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên thương hiệu")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập hình ảnh thương hiệu")]
        public IFormFile Image { get; set; }
    }
}
