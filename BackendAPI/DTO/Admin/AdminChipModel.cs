using BackendAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTO.Admin
{
    public class AdminChipModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ChipTypeId { get; set; }
        public AdminChipTypeModel? ChipType { get; set; }
    }
    public class AdminChipTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
