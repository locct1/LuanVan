using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductPurchaseOrderDetailService
    {
        Task CreateProductPurchaseOrderDetail(ProductPurchaseOrderDetail productPurchaseOrder);
        Task<ProductPurchaseOrderDetail> GetProductPurchaseOrderDetailById(int id);
    }
}
