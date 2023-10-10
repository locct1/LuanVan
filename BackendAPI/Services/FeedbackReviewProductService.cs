using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class FeedbackReviewProductService : IFeedbackReviewProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public FeedbackReviewProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<FeedbackReviewProduct>> GetAll()
        {
            return await _unitOfWork.GetRepository<FeedbackReviewProduct>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<FeedbackReviewProduct>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<FeedbackReviewProduct>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<FeedbackReviewProduct?> GetFeedbackReviewProductById(int id)
        {
            return await _unitOfWork.GetRepository<FeedbackReviewProduct>().GetByID(id);
        }

        public async Task CreateFeedbackReviewProduct(FeedbackReviewProduct newFeedbackReviewProduct)
        {
            await _unitOfWork.GetRepository<FeedbackReviewProduct>().Insert(newFeedbackReviewProduct);
        }
        public async Task UpdateFeedbackReviewProduct(int id, FeedbackReviewProduct updateFeedbackReviewProduct)
        {
            await _unitOfWork.GetRepository<FeedbackReviewProduct>().Update(updateFeedbackReviewProduct);
        }
        public async Task DeleteFeedbackReviewProduct(int id)
        {
            await _unitOfWork.GetRepository<FeedbackReviewProduct>().Delete(id);
        }
    }
}
