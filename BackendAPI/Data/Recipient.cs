using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("Recipient")]

    public class Recipient
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? Address { get; set; }
        public List<Order>? Orders { get; set; }
    }
}
