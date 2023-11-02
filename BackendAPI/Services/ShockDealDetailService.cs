using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ShockDealDetailService : IShockDealDetailService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ShockDealDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ShockDealDetail>> GetAll()
        {
            return await _unitOfWork.GetRepository<ShockDealDetail>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ShockDealDetail>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ShockDealDetail>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ShockDealDetail?> GetShockDealDetailById(int id)
        {
            return await _unitOfWork.GetRepository<ShockDealDetail>().GetByID(id);
        }

        public async Task CreateShockDealDetail(ShockDealDetail newShockDealDetail)
        {
            await _unitOfWork.GetRepository<ShockDealDetail>().Insert(newShockDealDetail);
        }
        public async Task UpdateShockDealDetail(int id, ShockDealDetail updateShockDealDetail)
        {
            await _unitOfWork.GetRepository<ShockDealDetail>().Update(updateShockDealDetail);
        }
        public async Task DeleteShockDealDetail(int id)
        {
            await _unitOfWork.GetRepository<ShockDealDetail>().Delete(id);
        }

        public async Task<ShockDealDetail> GetShockDealDetailByMainProductIdAndShockDealProductId(int mainProductId, int shockDealProductId,int shockDealId)
        {
            return await _unitOfWork.GetRepository<ShockDealDetail>().Get(filter: x => x.MainProductId == mainProductId && x.ShockDealProductId == shockDealProductId && x.ShockDealId == shockDealId);

        }
    }
}
