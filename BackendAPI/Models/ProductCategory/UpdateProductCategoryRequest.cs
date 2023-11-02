using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ProductCategory
{
    public class UpdateProductCategoryRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập id loại sản phẩm")]
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên loại sản phẩm")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập mã loại sản phẩm")]
        public string Code { get; set; }
    }
}
