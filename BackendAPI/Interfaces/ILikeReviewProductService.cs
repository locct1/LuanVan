using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface ILikeReviewProductService
    {
        Task<IEnumerable<LikeReviewProduct>> GetAll();
        Task<IEnumerable<LikeReviewProduct>> GetPagedList(int page, int limit);
        Task<LikeReviewProduct> GetLikeReviewProductById(int id);
        Task CreateLikeReviewProduct(LikeReviewProduct model);
        Task UpdateLikeReviewProduct(int id, LikeReviewProduct model);
        Task DeleteLikeReviewProduct(int id);
    }
}
