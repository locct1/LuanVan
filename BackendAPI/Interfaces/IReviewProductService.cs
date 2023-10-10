using BackendAPI.Data;
using BackendAPI.Helpers;
using Microsoft.AspNetCore.Identity;

namespace BackendAPI.Interfaces
{
    public interface IReviewProductService
    {
        Task<IEnumerable<ReviewProduct>> GetAll();
        Task<IEnumerable<ReviewProduct>> GetAllReviewProductsByProductId(int productId);
        Task<IEnumerable<ReviewProduct>> GetPagedList(int page, int limit);
        Task<ReviewProduct> GetReviewProductById(int id);
        Task<ReviewProduct> Get(int id);
        Task CreateReviewProduct(ReviewProduct model);
        Task UpdateReviewProduct(int id, ReviewProduct model);
        Task DeleteReviewProduct(int id);
    }
}
