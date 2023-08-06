using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface ISupplierService
    {
        Task<IEnumerable<Supplier>> GetAll();
        Task<IEnumerable<Supplier>> GetPagedList(int page, int limit);
        Task<Supplier> GetSupplierById(int id);
        Task CreateSupplier(Supplier brand);
        Task UpdateSupplier(int id, Supplier brand);
        Task DeleteSupplier(int id);
    }
}
