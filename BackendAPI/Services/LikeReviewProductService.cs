using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class LikeReviewProductService : ILikeReviewProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public LikeReviewProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<LikeReviewProduct>> GetAll()
        {
            return await _unitOfWork.GetRepository<LikeReviewProduct>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<LikeReviewProduct>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<LikeReviewProduct>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<LikeReviewProduct?> GetLikeReviewProductById(int id)
        {
            return await _unitOfWork.GetRepository<LikeReviewProduct>().GetByID(id);
        }

        public async Task CreateLikeReviewProduct(LikeReviewProduct newLikeReviewProduct)
        {
            await _unitOfWork.GetRepository<LikeReviewProduct>().Insert(newLikeReviewProduct);
        }
        public async Task UpdateLikeReviewProduct(int id, LikeReviewProduct updateLikeReviewProduct)
        {
            await _unitOfWork.GetRepository<LikeReviewProduct>().Update(updateLikeReviewProduct);
        }
        public async Task DeleteLikeReviewProduct(int id)
        {
            await _unitOfWork.GetRepository<LikeReviewProduct>().Delete(id);
        }
    }
}
