using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ReviewProductPhotoService : IReviewProductPhotoService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ReviewProductPhotoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ReviewProductPhoto>> GetAll()
        {
            return await _unitOfWork.GetRepository<ReviewProductPhoto>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ReviewProductPhoto>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ReviewProductPhoto>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ReviewProductPhoto?> GetReviewProductPhotoById(int id)
        {
            return await _unitOfWork.GetRepository<ReviewProductPhoto>().GetByID(id);
        }

        public async Task CreateReviewProductPhoto(ReviewProductPhoto newReviewProduct)
        {
            await _unitOfWork.GetRepository<ReviewProductPhoto>().Insert(newReviewProduct);
        }
        public async Task UpdateReviewProductPhoto(int id, ReviewProductPhoto updateReviewProduct)
        {
            await _unitOfWork.GetRepository<ReviewProductPhoto>().Update(updateReviewProduct);
        }
        public async Task DeleteReviewProductPhoto(int id)
        {
            await _unitOfWork.GetRepository<ReviewProductPhoto>().Delete(id);
        }
    }
}
