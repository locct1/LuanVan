using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class WareHouseService : IWareHouseService
    {
        private readonly IUnitOfWork _unitOfWork;
        public WareHouseService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<WareHouse>> GetAll()
        {
            return await _unitOfWork.GetRepository<WareHouse>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<WareHouse>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<WareHouse>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<WareHouse?> GetWareHouseById(int id)
        {
            return await _unitOfWork.GetRepository<WareHouse>().GetByID(id);
        }

        public async Task CreateWareHouse(WareHouse newWareHouse)
        {
            await _unitOfWork.GetRepository<WareHouse>().Insert(newWareHouse);
        }
        public async Task UpdateWareHouse(int id, WareHouse updateWareHouse)
        {
            await _unitOfWork.GetRepository<WareHouse>().Update(updateWareHouse);
        }
        public async Task DeleteWareHouse(int id)
        {
            await _unitOfWork.GetRepository<WareHouse>().Delete(id);
        }
    }
}
