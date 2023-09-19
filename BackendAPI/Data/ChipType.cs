using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("ChipType")]

    public class ChipType
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Chip>? Chips { get; set; }
    }
}
