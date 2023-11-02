using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Product
{
    public class CreateAccessoryRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập tên sản phẩm")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn thương hiệu cho sản phẩm")]
        public int? BrandId { get; set; }
        public bool Disabled { get; set; }
        public int Quantity { get; set; }
        [Required(ErrorMessage = "Vui lòng nhà kho cho sản phẩm")]
        public int? WareHouseId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập hình ảnh sản phẩm")]
        public IFormFile Image { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin  sản phẩm")]
        public string Infomation { get; set; }
        public string ColorProducts { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập loại sản phẩm")]
        public string ProductCategoryCode { get; set; }
        public int? HeadPhoneTime { get; set; }
        public int? ChargerPortId { get; set; }
        public int? JackPlugId { get; set; }
        public int? Battery { get; set; }
        public int? Charging { get; set; }
        public double PriceIn { get; set; }
        public double PriceOut { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập độ dày")]

        public int Height { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập khối lượng")]

        public int Weight { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập chiều dài")]

        public int Length { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập chiều rộng")]
        public int Width { get; set; }
    }
}
