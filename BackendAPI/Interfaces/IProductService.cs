using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAll();
        Task<Product> Get(int id);
        Task<IEnumerable<Product>> GetPagedList(int page, int limit);
        Task<Product> GetProductById(int id);
        Task CreateProduct(Product product);
        Task UpdateProduct(int id, Product product);
        Task DeleteProduct(int id);
        Task<IEnumerable<Chip>> GetAllChips();
        Task<IEnumerable<ChipType>> GetAllChipTypes();
        Task<IEnumerable<Ram>> GetAllRams();
        Task<IEnumerable<Rom>> GetAllRoms();
        Task<IEnumerable<OperatingSystemType>> GetAllOpertingSystemTypes();
        Task<IEnumerable<OperatingSystemProduct>> GetAllOpertingSystems();
        Task<IEnumerable<ScreenTechnology>> GetAllScreenTechnologies();

    }
}
