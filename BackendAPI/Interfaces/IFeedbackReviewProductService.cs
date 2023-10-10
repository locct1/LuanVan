using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IFeedbackReviewProductService
    {
        Task<IEnumerable<FeedbackReviewProduct>> GetAll();
        Task<IEnumerable<FeedbackReviewProduct>> GetPagedList(int page, int limit);
        Task<FeedbackReviewProduct> GetFeedbackReviewProductById(int id);
        Task CreateFeedbackReviewProduct(FeedbackReviewProduct feedbackReviewProduct);
        Task UpdateFeedbackReviewProduct(int id, FeedbackReviewProduct feedbackReviewProduct);
        Task DeleteFeedbackReviewProduct(int id);
    }
}
