using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class PromotionProductService : IPromotionProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public PromotionProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<PromotionProduct>> GetAll()
        {
            return await _unitOfWork.GetRepository<PromotionProduct>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<PromotionProduct>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<PromotionProduct>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<PromotionProduct?> GetPromotionProductById(int id)
        {
            return await _unitOfWork.GetRepository<PromotionProduct>().Get(include: p => p.Include(p => p.PromotionProductDetails).ThenInclude(p => p.ProductVersion).ThenInclude(x=>x.Product).ThenInclude(x=>x.ProductVersions).Include(p => p.PromotionProductDetails).ThenInclude(p => p.ProductVersion).ThenInclude(x => x.Ram).Include(p => p.PromotionProductDetails).ThenInclude(p => p.ProductVersion).ThenInclude(x => x.Rom),
                                                    filter: x => x.Id == id);
        }

        public async Task CreatePromotionProduct(PromotionProduct newPromotionProduct)
        {
            await _unitOfWork.GetRepository<PromotionProduct>().Insert(newPromotionProduct);
        }
        public async Task UpdatePromotionProduct(int id, PromotionProduct updatePromotionProduct)
        {
            await _unitOfWork.GetRepository<PromotionProduct>().Update(updatePromotionProduct);
        }
        public async Task DeletePromotionProduct(int id)
        {
            await _unitOfWork.GetRepository<PromotionProduct>().Delete(id);
        }

        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(
               include: p => p.Include(p => p.ProductColorProducts).ThenInclude(x => x.ColorProduct).Include(x => x.ProductVersions).ThenInclude(x => x.Ram).Include(x => x.ProductVersions).ThenInclude(x => x.Rom));
        }
    }
}
