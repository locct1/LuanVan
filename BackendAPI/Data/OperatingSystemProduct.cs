using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("OperatingSystemProduct")]
    public class OperatingSystemProduct
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int? OperatingSystemTypeId { get; set; }
        [ForeignKey(nameof(OperatingSystemTypeId))]
        public OperatingSystemType? OperatingSystemType { get; set; }
        public List<Product>? Products { get; set; }


    }
}
