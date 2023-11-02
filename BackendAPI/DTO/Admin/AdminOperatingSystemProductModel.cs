using BackendAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTO.Admin
{
    public class AdminOperatingSystemProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? OperatingSystemTypeId { get; set; }
        public AdminOperatingSystemTypeModel? OperatingSystemType { get; set; }
    }
    public class AdminOperatingSystemTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
