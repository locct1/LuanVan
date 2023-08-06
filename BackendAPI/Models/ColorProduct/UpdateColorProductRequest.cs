using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ColorProduct
{
    public class UpdateColorProductRequest
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập màu sắc")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập mã màu sắc")]
        public string CodeColor { get; set; }
    }
}
