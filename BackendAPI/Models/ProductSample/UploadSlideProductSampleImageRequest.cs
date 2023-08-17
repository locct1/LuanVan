using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ProductSample
{
    public class UploadSlideProductSampleImageRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập id Mẫu sản phẩm")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập hình ảnh sản phẩm")]

        public List<IFormFile> Images { get; set; }
    }
}
