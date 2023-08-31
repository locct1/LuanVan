using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("PaymentMethod")]

    public class PaymentMethod
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string Name { get; set; }
        public List<Order>? Orders { get; set; }

    }
}
