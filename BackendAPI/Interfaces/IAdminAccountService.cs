using BackendAPI.Helpers;
using BackendAPI.Models.AdminAccount;

namespace BackendAPI.Interfaces
{
    public interface IAdminAccountService
    {
        public Task<ResponseToken> SignInAsync(SignInAdminModel model);
        public Task<Response> GetInfoAdminAsync(string Id);
    }
}
