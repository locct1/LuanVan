using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ProductCategoryService : IProductCategoryService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductCategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ProductCategory>> GetAll()
        {
            return await _unitOfWork.GetRepository<ProductCategory>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ProductCategory>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ProductCategory>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ProductCategory?> GetProductCategoryById(int id)
        {
            return await _unitOfWork.GetRepository<ProductCategory>().GetByID(id);
        }

        public async Task CreateProductCategory(ProductCategory newProductCategory)
        {
            await _unitOfWork.GetRepository<ProductCategory>().Insert(newProductCategory);
        }
        public async Task UpdateProductCategory(int id, ProductCategory updateProductCategory)
        {
            await _unitOfWork.GetRepository<ProductCategory>().Update(updateProductCategory);
        }
        public async Task DeleteProductCategory(int id)
        {
            await _unitOfWork.GetRepository<ProductCategory>().Delete(id);
        }
    }
}
