using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("WareHouse")]

    public class WareHouse
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public List<Product>? Products { get; set; }
        public List<ProductPurchaseOrder>? ProductPurchaseOrders { get; set; }

    }
}
