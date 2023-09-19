using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ProductVersionService : IProductVersionService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductVersionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ProductVersion>> GetAll()
        {
            return await _unitOfWork.GetRepository<ProductVersion>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ProductVersion>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ProductVersion>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ProductVersion?> GetProductVersionById(int id)
        {
            return await _unitOfWork.GetRepository<ProductVersion>().GetByID(id);
        }

        public async Task CreateProductVersion(ProductVersion newProductVersion)
        {
            await _unitOfWork.GetRepository<ProductVersion>().Insert(newProductVersion);
        }
        public async Task UpdateProductVersion(int id, ProductVersion updateProductVersion)
        {
            await _unitOfWork.GetRepository<ProductVersion>().Update(updateProductVersion);
        }
        public async Task DeleteProductVersion(int id)
        {
            await _unitOfWork.GetRepository<ProductVersion>().Delete(id);
        }
        public async Task DeleteProductVersionByColorProduct(int id)
        {
            await _unitOfWork.GetRepository<ProductVersion>().Delete(id);
        }

    }
}
