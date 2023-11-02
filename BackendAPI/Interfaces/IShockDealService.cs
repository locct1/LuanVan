using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IShockDealService
    {
        Task<IEnumerable<ShockDeal>> GetAll();
        Task<IEnumerable<ShockDeal>> GetPagedList(int page, int limit);
        Task<ShockDeal> GetShockDealById(int id);
        Task<ShockDeal> Get(int id);
        Task CreateShockDeal(ShockDeal shockDeal);
        Task UpdateShockDeal(int id, ShockDeal shockDeal);
        Task DeleteShockDeal(int id);
    }
}
