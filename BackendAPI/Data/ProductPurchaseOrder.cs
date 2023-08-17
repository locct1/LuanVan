using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("ProductPurchaseOrder")]
    public class ProductPurchaseOrder
    {
        [Key]
        public int Id { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? WareHouseId { get; set; }
        [ForeignKey(nameof(WareHouseId))]
        public WareHouse? WareHouse { get; set; }

        public int? SupplierId { get; set; }
        [ForeignKey(nameof(SupplierId))]
        public Supplier? Supplier { get; set; }
        public string? UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }
        public int StatusId { get; set; }
        public double Total { get; set; }
        public List<ProductPurchaseOrderDetail> ProductPurchaseOrderDetails { get; set; }
    }
}
