using BackendAPI.Data;
using BackendAPI.Interfaces.Client;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services.Client
{
    public class PageService : IPageService
    {
        private readonly IUnitOfWork _unitOfWork;
        public PageService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Brand>> GetAllBrands()
        {
            return await _unitOfWork.GetRepository<Brand>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse), orderBy: x => x.OrderByDescending(x => x.Id));
        }

        public async Task<IEnumerable<Product>> GetAllProductsByBrandId(int id)
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse), orderBy: x => x.OrderByDescending(x => x.Id), filter: x => x.BrandId == id);

        }
        public async Task<Brand?> GetBrandById(int id)
        {
            return await _unitOfWork.GetRepository<Brand>().GetByID(id);
        }
        public async Task<Product?> GetProductById(int id)
        {
            return await _unitOfWork.GetRepository<Product>().Get(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse)
                                                    .Include(p => p.ProductSamples).ThenInclude(p => p.ColorProduct)
                                                    .Include(p => p.ProductSamples).ThenInclude(s => s.Photos),
                                                    filter: x => x.Id == id);

        }
    }
}
