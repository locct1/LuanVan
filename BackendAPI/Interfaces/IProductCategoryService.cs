using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductCategoryService
    {
        Task<IEnumerable<ProductCategory>> GetAll();
        Task<IEnumerable<ProductCategory>> GetPagedList(int page, int limit);
        Task<ProductCategory> GetProductCategoryById(int id);
        Task CreateProductCategory(ProductCategory productCategory);
        Task UpdateProductCategory(int id, ProductCategory productCategory);
        Task DeleteProductCategory(int id);
    }
}
