using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ProductSample
{
    public class UploadImageProduct360Request
    {
        [Required(ErrorMessage = "Vui lòng nhập id  sản phẩm")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập hình ảnh sản phẩm")]
        public List<IFormFile> Images { get; set; }
    }
}
