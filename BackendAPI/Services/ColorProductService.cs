using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ColorProductService : IColorProductService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ColorProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<ColorProduct>> GetAll()
        {
            return await _unitOfWork.GetRepository<ColorProduct>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<ColorProduct>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ColorProduct>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ColorProduct?> GetColorProductById(int id)
        {
            return await _unitOfWork.GetRepository<ColorProduct>().GetByID(id);
        }

        public async Task CreateColorProduct(ColorProduct newColorProduct)
        {
            await _unitOfWork.GetRepository<ColorProduct>().Insert(newColorProduct);
        }
        public async Task UpdateColorProduct(int id, ColorProduct updateColorProduct)
        {
            await _unitOfWork.GetRepository<ColorProduct>().Update(updateColorProduct);
        }
        public async Task DeleteColorProduct(int id)
        {
            await _unitOfWork.GetRepository<ColorProduct>().Delete(id);
        }
    }
}
