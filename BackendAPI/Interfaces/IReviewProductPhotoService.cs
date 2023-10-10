using BackendAPI.Data;
using BackendAPI.Helpers;

namespace BackendAPI.Interfaces
{
    public interface IReviewProductPhotoService
    {
        Task<IEnumerable<ReviewProductPhoto>> GetAll();
        Task<IEnumerable<ReviewProductPhoto>> GetPagedList(int page, int limit);
        Task<ReviewProductPhoto> GetReviewProductPhotoById(int id);
        Task CreateReviewProductPhoto(ReviewProductPhoto colorProduct);
        Task UpdateReviewProductPhoto(int id, ReviewProductPhoto colorProduct);
        Task DeleteReviewProductPhoto(int id);
    }
}
