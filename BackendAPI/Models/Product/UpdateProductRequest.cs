using BackendAPI.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Models.Product
{
    public class UpdateProductRequest
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên sản phẩm")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn thương hiệu cho sản phẩm")]
        public int? BrandId { get; set; }
        public bool Disabled { get; set; }
        public int Quantity { get; set; }
        [Required(ErrorMessage = "Vui lòng nhà kho cho sản phẩm")]
        public int? WareHouseId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập giá nhập sản phẩm")]
        public double PriceIn { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập giá bán sản phẩm")]
        public double PriceOut { get; set; }
        public IFormFile? Image { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin  sản phẩm")]
        public string Infomation { get; set; }
        [Required(ErrorMessage = "Vui lòng thông số kỹ thuật sản phẩm")]
        public string TechnicalDetail { get; set; }
        public string ColorProducts { get; set; }

    }
}
