using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IPromotionProductDetailService
    {
        Task<IEnumerable<PromotionProductDetail>> GetAll();
        Task<IEnumerable<PromotionProductDetail>> GetPagedList(int page, int limit);
        Task<PromotionProductDetail?> GetPromotionProductDetailById(int id);
        Task<PromotionProductDetail> GetPromotionProductDetailByPromotionProductIdAndProductVersionId(int promotionProductId, int productVersionId);
        Task CreatePromotionProductDetail(PromotionProductDetail promotionProductDetail);
        Task UpdatePromotionProductDetail(int id, PromotionProductDetail promotionProductDetail);
        Task DeletePromotionProductDetail(int id);
    }
}
