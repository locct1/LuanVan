using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IPhotoService
    {
        Task<IEnumerable<Photo>> GetAll();
        Task<IEnumerable<Photo>> GetPagedList(int page, int limit);
        Task<Photo> GetPhotoById(int id);
        Task CreatePhoto(Photo warehouse);
        Task UpdatePhoto(int id, Photo photo);
        Task<IEnumerable<Photo>> GetAllPhotosByProductColorProductId(int productColorProductId);
        Task<IEnumerable<Photo>> GetAllPhotosByProductId(int productId);
        Task DeletePhoto(int id);
    }
}
