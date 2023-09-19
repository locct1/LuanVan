using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductVersionService
    {
        Task<IEnumerable<ProductVersion>> GetAll();
        Task<IEnumerable<ProductVersion>> GetPagedList(int page, int limit);
        Task<ProductVersion> GetProductVersionById(int id);
        Task CreateProductVersion(ProductVersion productVersion);
        Task UpdateProductVersion(int id, ProductVersion productVersion);
        Task DeleteProductVersion(int id);
    }
}
