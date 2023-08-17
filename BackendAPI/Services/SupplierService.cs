using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly IUnitOfWork _unitOfWork;
        public SupplierService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Supplier>> GetAll()
        {
            return await _unitOfWork.GetRepository<Supplier>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<Supplier>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<Supplier>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<Supplier?> GetSupplierById(int id)
        {
            return await _unitOfWork.GetRepository<Supplier>().GetByID(id);
        }

        public async Task CreateSupplier(Supplier newSupplier)
        {
            await _unitOfWork.GetRepository<Supplier>().Insert(newSupplier);
        }
        public async Task UpdateSupplier(int id, Supplier updateSupplier)
        {
            await _unitOfWork.GetRepository<Supplier>().Update(updateSupplier);
        }
        public async Task DeleteSupplier(int id)
        {
            await _unitOfWork.GetRepository<Supplier>().Delete(id);
        }
    }
}
