using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BackendAPI.Services
{
    public class ProductService : IProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Product>> GetAll()
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse));
        }
        public async Task<IEnumerable<Product>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<Product>().GetPagedList(null, null, include: p => p.Include(p => p.Brand).Include(p => p.WareHouse), page, limit);
        }
        public async Task<Product?> GetProductById(int id)
        {
            return await _unitOfWork.GetRepository<Product>().GetByID(id);
        }

        public async Task CreateProduct(Product newProduct)
        {
            await _unitOfWork.GetRepository<Product>().Insert(newProduct);
        }
        public async Task UpdateProduct(int id, Product updateProduct)
        {
            await _unitOfWork.GetRepository<Product>().Update(updateProduct);
        }
        public async Task DeleteProduct(int id)
        {
            await _unitOfWork.GetRepository<Product>().Delete(id);
        }

        public async Task<Product?> Get(int id)
        {
            return await _unitOfWork.GetRepository<Product>().Get(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse)
                                                    .Include(p => p.ProductSamples).ThenInclude(p => p.ColorProduct),
                                                    filter: x => x.Id == id);

        }
    }
}
