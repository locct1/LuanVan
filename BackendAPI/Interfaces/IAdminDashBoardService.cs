using BackendAPI.Helpers;

namespace BackendAPI.Interfaces
{
    public interface IAdminDashBoardService
    {
            public Task<Response> GetAll();
    }
}
