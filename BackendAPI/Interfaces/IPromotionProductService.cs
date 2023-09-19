using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IPromotionProductService
    {
        Task<IEnumerable<PromotionProduct>> GetAll();
        Task<IEnumerable<Product>> GetAllProducts();
        Task<IEnumerable<PromotionProduct>> GetPagedList(int page, int limit);
        Task<PromotionProduct> GetPromotionProductById(int id);
        Task CreatePromotionProduct(PromotionProduct promotionProduct);
        Task UpdatePromotionProduct(int id, PromotionProduct promotionProduct);
        Task DeletePromotionProduct(int id);
    }
}
