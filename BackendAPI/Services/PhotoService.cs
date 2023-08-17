using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly IUnitOfWork _unitOfWork;
        public PhotoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Photo>> GetAll()
        {
            return await _unitOfWork.GetRepository<Photo>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<Photo>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<Photo>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<Photo?> GetPhotoById(int id)
        {
            return await _unitOfWork.GetRepository<Photo>().GetByID(id);
        }

        public async Task CreatePhoto(Photo newPhoto)
        {
            await _unitOfWork.GetRepository<Photo>().Insert(newPhoto);
        }
        public async Task UpdatePhoto(int id, Photo updatePhoto)
        {
            await _unitOfWork.GetRepository<Photo>().Update(updatePhoto);
        }
        public async Task DeletePhoto(int id)
        {
            await _unitOfWork.GetRepository<Photo>().Delete(id);
        }
    }
}
