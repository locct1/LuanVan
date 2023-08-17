using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface ISupplierService
    {
        Task<IEnumerable<Supplier>> GetAll();
        Task<IEnumerable<Supplier>> GetPagedList(int page, int limit);
        Task<Supplier> GetSupplierById(int id);
        Task CreateSupplier(Supplier supplier);
        Task UpdateSupplier(int id, Supplier supplier);
        Task DeleteSupplier(int id);
    }
}
