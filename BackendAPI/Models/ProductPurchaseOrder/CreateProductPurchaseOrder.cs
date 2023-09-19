namespace BackendAPI.Models.ProductPurchaseOrder
{
    public class CreateProductPurchaseOrderRequest
    {
        public int WarehouseId { get; set; }
        public int SupplierId { get; set; }
        public int Total { get; set; }
        public List<ProductPurchaseOrderDetailRequest> ListProductPurchaseOrders { get; set; }

    }
    public class ProductPurchaseOrderDetailRequest
    {
        public int ProductVersionId { get; set; }
        public int ColorProductId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double PriceIn { get; set; }

    }
}
