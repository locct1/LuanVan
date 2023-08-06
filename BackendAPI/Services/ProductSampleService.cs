using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ProductSampleService : IProductSampleService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductSampleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ProductSample>> GetAll()
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetAll();
        }
        public async Task<IEnumerable<ProductSample>> GetAllByProductId(int id)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetAll(filter: x => x.ProductId == id);
        }
        public async Task<IEnumerable<ProductSample>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ProductSample?> GetProductSampleById(int id)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetByID(id);
        }

        public async Task CreateProductSample(ProductSample newProductSample)
        {
            await _unitOfWork.GetRepository<ProductSample>().Insert(newProductSample);
        }
        public async Task UpdateProductSample(int id, ProductSample updateProductSample)
        {
            await _unitOfWork.GetRepository<ProductSample>().Update(updateProductSample);
        }
        public async Task DeleteProductSample(int id)
        {
            await _unitOfWork.GetRepository<ProductSample>().Delete(id);
        }
    }
}
