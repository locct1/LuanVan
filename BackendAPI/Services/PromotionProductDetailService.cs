using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class PromotionProductDetailService : IPromotionProductDetailService

    {
        private readonly IUnitOfWork _unitOfWork;
        public PromotionProductDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<PromotionProductDetail>> GetAll()
        {
            return await _unitOfWork.GetRepository<PromotionProductDetail>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<PromotionProductDetail>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<PromotionProductDetail>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<PromotionProductDetail?> GetPromotionProductDetailById(int id)
        {

            var result = await _unitOfWork.GetRepository<PromotionProductDetail>().GetByID(id);
            if (result == null)
            {
                return null;
            }
            // Process the result and return it
            return result;

        }
        public async Task<PromotionProductDetail?> GetPromotionProductDetailByPromotionProductIdAndProductVersionId(int promotionProductId, int productVersionId)
        {
            return await _unitOfWork.GetRepository<PromotionProductDetail>().Get(filter: x => x.PromotionProductId == promotionProductId && x.ProductVersionId == productVersionId);
        }
        public async Task CreatePromotionProductDetail(PromotionProductDetail newPromotionProductDetail)
        {
            await _unitOfWork.GetRepository<PromotionProductDetail>().Insert(newPromotionProductDetail);
        }
        public async Task UpdatePromotionProductDetail(int id, PromotionProductDetail updatePromotionProductDetail)
        {
            await _unitOfWork.GetRepository<PromotionProductDetail>().Update(updatePromotionProductDetail);
        }
        public async Task DeletePromotionProductDetail(int id)
        {
            await _unitOfWork.GetRepository<PromotionProductDetail>().Delete(id);
        }
    }
}
