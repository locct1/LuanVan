using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductPurchaseOrderDetailService
    {
        Task CreateProductPurchaseOrderDetail(ProductPurchaseOrderDetail productPurchaseOrderDetail);
        Task<ProductPurchaseOrderDetail> GetProductPurchaseOrderDetailById(int id);
        Task<ProductPurchaseOrderDetail> GetProductPurchaseOrderDetailFirstĐefaultByStatus(int ProductSampleId);
        Task UpdateProductPurchaseOrderDetail(int id, ProductPurchaseOrderDetail productPurchaseOrderDetail);
    }
}
