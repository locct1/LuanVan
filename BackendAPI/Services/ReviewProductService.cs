using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ReviewProductService : IReviewProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ReviewProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ReviewProduct>> GetAll()
        {
            return await _unitOfWork.GetRepository<ReviewProduct>().GetAll(orderBy: x => x.OrderByDescending(x => x.CreatedAt), include: p => p.Include(p => p.ReviewProductPhotos).Include(x => x.FeedbackReviewProducts).Include(u => u.User).Include(u => u.LikeReviewProducts).Include(u => u.Product));
        }
        public async Task<IEnumerable<ReviewProduct>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ReviewProduct>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ReviewProduct?> GetReviewProductById(int id)
        {
            return await _unitOfWork.GetRepository<ReviewProduct>().GetByID(id);
        }

        public async Task CreateReviewProduct(ReviewProduct newReviewProduct)
        {
            await _unitOfWork.GetRepository<ReviewProduct>().Insert(newReviewProduct);
        }
        public async Task UpdateReviewProduct(int id, ReviewProduct updateReviewProduct)
        {
            await _unitOfWork.GetRepository<ReviewProduct>().Update(updateReviewProduct);
        }
        public async Task DeleteReviewProduct(int id)
        {
            await _unitOfWork.GetRepository<ReviewProduct>().Delete(id);
        }

        public async Task<IEnumerable<ReviewProduct>> GetAllReviewProductsByProductId(int productId)
        {
            return await _unitOfWork.GetRepository<ReviewProduct>().GetAll(orderBy: x => x.OrderByDescending(x => x.CreatedAt), filter: x => x.ProductId == productId, include: p => p.Include(p => p.ReviewProductPhotos).Include(x => x.FeedbackReviewProducts).ThenInclude(x => x.User).Include(u => u.User).Include(u => u.LikeReviewProducts));

        }

        public async Task<ReviewProduct> Get(int id)
        {
            return await _unitOfWork.GetRepository<ReviewProduct>().Get(filter: x => x.Id == id, include: p => p.Include(p => p.ReviewProductPhotos).Include(x => x.FeedbackReviewProducts).Include(u => u.User).Include(u => u.LikeReviewProducts));

        }
    }
}
