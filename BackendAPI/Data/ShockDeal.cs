using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("ShockDeal")]

    public class ShockDeal
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Disabled { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<ShockDealDetail>? ShockDealDetails { get; set; }
    }
}
