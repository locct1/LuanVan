using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("OrderDetail")]
    public class OrderDetail
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string FileName { get; set; }
        [ForeignKey(nameof(OrderId))]
        public int? OrderId { get; set; }
        public bool IsShockDeal { get; set; }
        public Order? Order { get; set; }

        [ForeignKey(nameof(ProductPurchaseOrderDetailId))]
        public int ProductPurchaseOrderDetailId { get; set; }
        public ProductPurchaseOrderDetail ProductPurchaseOrderDetail { get; set; }
        public double PriceOut { get; set; }
    }
}
