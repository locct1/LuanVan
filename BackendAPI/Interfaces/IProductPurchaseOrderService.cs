using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductPurchaseOrderService
    {
        Task<IEnumerable<Product>> GetAllProductByWareHouseId(int id);
        Task CreateProductPurchaseOrder(ProductPurchaseOrder productPurchaseOrder);
        Task<IEnumerable<ProductPurchaseOrder>> GetAll();
        Task<ProductPurchaseOrder> GetProductPurchaseOrderById(int id);

    }
}
