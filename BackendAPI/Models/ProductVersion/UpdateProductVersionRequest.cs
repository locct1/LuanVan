using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ProductVersion
{
    public class UpdateProductVersionRequest
    {
        [Required(ErrorMessage = "Vui lòng nhập thông tin ram")]
        public int? Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin ram")]
        public int RamId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin rom")]
        public int RomId { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin giá nhập")]
        public double PriceIn { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập thông tin giá bán")]
        public double PriceOut { get; set; }
    }
}
