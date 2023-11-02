using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IShockDealDetailService
    {
        Task<IEnumerable<ShockDealDetail>> GetAll();
        Task<IEnumerable<ShockDealDetail>> GetPagedList(int page, int limit);
        Task<ShockDealDetail> GetShockDealDetailById(int id);
        Task CreateShockDealDetail(ShockDealDetail shockDealDetail);
        Task UpdateShockDealDetail(int id, ShockDealDetail shockDealDetail);
        Task DeleteShockDealDetail(int id);
        Task<ShockDealDetail> GetShockDealDetailByMainProductIdAndShockDealProductId(int mainProductId, int shockDealProductId, int shockDealId);

    }
}
