using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ShockDealService : IShockDealService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ShockDealService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ShockDeal>> GetAll()
        {
            return await _unitOfWork.GetRepository<ShockDeal>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ShockDeal>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ShockDeal>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ShockDeal?> GetShockDealById(int id)
        {
            return await _unitOfWork.GetRepository<ShockDeal>().GetByID(id);
        }
        public async Task<ShockDeal?> Get(int id)
        {
            return await _unitOfWork.GetRepository<ShockDeal>().Get(include: p => p.Include(p => p.ShockDealDetails).ThenInclude(x => x.MainProduct).ThenInclude(x => x.ProductVersions).Include(p => p.ShockDealDetails).ThenInclude(x => x.ProductShockDeal).ThenInclude(x => x.ProductVersions),
                                                    filter: x => x.Id == id);
        }
        public async Task CreateShockDeal(ShockDeal newShockDeal)
        {
            await _unitOfWork.GetRepository<ShockDeal>().Insert(newShockDeal);
        }
        public async Task UpdateShockDeal(int id, ShockDeal updateShockDeal)
        {
            await _unitOfWork.GetRepository<ShockDeal>().Update(updateShockDeal);
        }
        public async Task DeleteShockDeal(int id)
        {
            await _unitOfWork.GetRepository<ShockDeal>().Delete(id);
        }
    }
}
