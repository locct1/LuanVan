using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class BrandService : IBrandService

    {
        private readonly IUnitOfWork _unitOfWork;
        public BrandService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Brand>> GetAll()
        {
            return await _unitOfWork.GetRepository<Brand>().GetAll();
        }
        public async Task<IEnumerable<Brand>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<Brand>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<Brand?> GetBrandById(int id)
        {
            return await _unitOfWork.GetRepository<Brand>().GetByID(id);
        }

        public async Task CreateBrand(Brand newBrand)
        {
            await _unitOfWork.GetRepository<Brand>().Insert(newBrand);
        }
        public async Task UpdateBrand(int id, Brand updateBrand)
        {
            await _unitOfWork.GetRepository<Brand>().Update(updateBrand);
        }
        public async Task DeleteBrand(int id)
        {
            await _unitOfWork.GetRepository<Brand>().Delete(id);
        }
    }
}
