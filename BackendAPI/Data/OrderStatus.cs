using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("OrderStatus")]
    public class OrderStatus
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Order> Orders { get; set; }
    }
}
