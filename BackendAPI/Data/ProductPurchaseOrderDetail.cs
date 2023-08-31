using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("ProductPurchaseOrderDetail")]

    public class ProductPurchaseOrderDetail
    {
        [Key]
        public int Id { get; set; }
        public ProductSample ProductSample { get; set; }
        [ForeignKey(nameof(ProductSampleId))]
        public int ProductSampleId { get; set; }
        public string Name { get; set; }
        public int StatusId { get; set; }
        public double PriceIn { get; set; }
        public ProductPurchaseOrder ProductPurchaseOrder { get; set; }
        [ForeignKey(nameof(ProductPurchaseOrderId))]
        public int ProductPurchaseOrderId { get; set; }
    }
}
