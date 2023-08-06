using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IWareHouseService
    {
        Task<IEnumerable<WareHouse>> GetAll();
        Task<IEnumerable<WareHouse>> GetPagedList(int page, int limit);
        Task<WareHouse> GetWareHouseById(int id);
        Task CreateWareHouse(WareHouse warehouse);
        Task UpdateWareHouse(int id, WareHouse warehouse);
        Task DeleteWareHouse(int id);
    }
}
