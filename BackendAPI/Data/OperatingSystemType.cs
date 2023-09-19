using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("OperatingSystemType")]

    public class OperatingSystemType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public List<OperatingSystemProduct>? OperatingSystems { get; set; }

    }
}
