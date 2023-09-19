using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ProductColorProductService : IProductColorProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductColorProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ProductColorProduct>> GetAll()
        {
            return await _unitOfWork.GetRepository<ProductColorProduct>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ProductColorProduct>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ProductColorProduct>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ProductColorProduct?> GetProductColorProductById(int id)
        {
            return await _unitOfWork.GetRepository<ProductColorProduct>().GetByID(id);
        }

        public async Task CreateProductColorProduct(ProductColorProduct newProductColorProduct)
        {
            await _unitOfWork.GetRepository<ProductColorProduct>().Insert(newProductColorProduct);
        }
        public async Task UpdateProductColorProduct(int id, ProductColorProduct updateProductColorProduct)
        {
            await _unitOfWork.GetRepository<ProductColorProduct>().Update(updateProductColorProduct);
        }
        public async Task DeleteProductColorProduct(int id)
        {
            await _unitOfWork.GetRepository<ProductColorProduct>().Delete(id);
        }
    }
}
