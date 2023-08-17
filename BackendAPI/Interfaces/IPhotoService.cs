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
        Task DeletePhoto(int id);
    }
}
