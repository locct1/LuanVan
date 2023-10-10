using BackendAPI.Models.ColorProduct;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.Product
{
    public class CreateProductRequest
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
        public string ProductVersionList { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn thông tin phiên bản Ram hoặc Rom")]
        public bool IsVersionRam { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin độ phân giải")]
        public string Resolution { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin chiều rộng màn hình")]
        public double ScreenWidth { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin camera trước")]
        public string FrontCamera { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin camera sau")]
        public string RearCamera { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin pin")]
        public int Battery { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin SIM")]
        public string Sim { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin cách sạc")]
        public int Charging { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn công nghệ màn hình")]
        public int ScreenTechnologyId { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn chip")]
        public int ChipId { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn hệ điều hành")]
        public int OperatingSystemId { get; set; }
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
