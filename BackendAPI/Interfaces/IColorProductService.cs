using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IColorProductService
    {
        Task<IEnumerable<ColorProduct>> GetAll();
        Task<IEnumerable<ColorProduct>> GetPagedList(int page, int limit);
        Task<ColorProduct> GetColorProductById(int id);
        Task CreateColorProduct(ColorProduct colorProduct);
        Task UpdateColorProduct(int id, ColorProduct colorProduct);
        Task DeleteColorProduct(int id);
    }
}
