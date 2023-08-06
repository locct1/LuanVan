using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.WareHouse
{
    public class UpdateWareHouseRequest
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập tên nhà kho")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập địa chỉ nhà kho")]
        public string Address { get; set; }
    }
}
