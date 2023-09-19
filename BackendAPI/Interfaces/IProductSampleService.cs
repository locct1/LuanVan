using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductSampleService
    {
        Task<IEnumerable<ProductSample>> GetAll();
        Task<IEnumerable<ProductSample>> GetAllProductSamplesByProductVersion(int productVersionId);
        Task<IEnumerable<ProductSample>> GetAllProductSamplesByColorProduct(int colorProductId);
        Task<IEnumerable<ProductSample>> GetAllByProductId(int id);
        Task<IEnumerable<ProductSample>> GetPagedList(int page, int limit);
        Task<ProductSample> GetProductSampleById(int id);
        Task<ProductSample> Get(int id);
        Task CreateProductSample(ProductSample productSample);
        Task UpdateProductSample(int id, ProductSample productSample);
        Task DeleteProductSample(int id);
        Task<ProductSample> GetProductSampleByProductVersionAndColorProduct(int productVersionId, int colorProductId);

    }
}
