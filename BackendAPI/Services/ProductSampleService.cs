using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

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
            return await _unitOfWork.GetRepository<ProductSample>().GetAll(include: p => p.Include(p => p.ColorProduct).Include(p => p.ProductVersion).ThenInclude(x=>x.Ram).Include(p => p.ProductVersion).ThenInclude(x => x.Rom).Include(p => p.ProductVersion).ThenInclude(x => x.Product).ThenInclude(x=>x.WareHouse),
            orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ProductSample>> GetAllByProductId(int id)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetAll();
        }
        public async Task<IEnumerable<ProductSample>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ProductSample?> GetProductSampleById(int id)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetByID(id);
        }
        public async Task<ProductSample?> Get(int id)
        {
            return await _unitOfWork.GetRepository<ProductSample>().Get();
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

        public async Task<ProductSample> GetProductSampleByProductVersionAndColorProduct(int productVersionId, int colorProductId)
        {
            return await _unitOfWork.GetRepository<ProductSample>().Get(filter: x => x.ColorProductId == colorProductId && x.ProductVersionId == productVersionId,
                include: p => p.Include(p => p.ProductVersion).ThenInclude(x => x.Product).Include(x => x.ColorProduct).Include(p => p.ProductVersion).ThenInclude(x => x.Ram).Include(p => p.ProductVersion).ThenInclude(x => x.Rom));
        }

        public async Task<IEnumerable<ProductSample>> GetAllProductSamplesByProductVersion(int productVersionId)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetAll(filter: x => x.ProductVersionId == productVersionId);
        }

        public async Task<IEnumerable<ProductSample>> GetAllProductSamplesByColorProduct(int colorProductId)
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetAll(filter: x => x.ProductVersionId == colorProductId);
        }
    }
}
