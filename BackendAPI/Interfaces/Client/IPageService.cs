using BackendAPI.Data;

namespace BackendAPI.Interfaces.Client
{
    public interface IPageService
    {
        Task<IEnumerable<Brand>> GetAllBrands();
        Task<Brand> GetBrandById(int id);
        Task<IEnumerable<Product>> GetAllProducts();
        Task<IEnumerable<Product>> GetAllProductsByBrandId(int id);
        Task<Product> GetProductById(int id);


    }
}
