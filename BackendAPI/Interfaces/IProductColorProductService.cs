using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductColorProductService
    {
        Task<IEnumerable<ProductColorProduct>> GetAll();
        Task<IEnumerable<ProductColorProduct>> GetPagedList(int page, int limit);
        Task<ProductColorProduct> GetProductColorProductById(int id);
        Task CreateProductColorProduct(ProductColorProduct colorProduct);
        Task UpdateProductColorProduct(int id, ProductColorProduct colorProduct);
        Task DeleteProductColorProduct(int id);
    }
}
