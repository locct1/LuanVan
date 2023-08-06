using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IBrandService
    {
        Task<IEnumerable<Brand>> GetAll();
        Task<IEnumerable<Brand>> GetPagedList(int page, int limit);
        Task<Brand> GetBrandById(int id);
        Task CreateBrand(Brand brand);
        Task UpdateBrand(int id, Brand brand);
        Task DeleteBrand(int id);
    }
}
