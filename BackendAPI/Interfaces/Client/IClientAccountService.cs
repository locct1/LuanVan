using BackendAPI.Helpers;
using BackendAPI.Models.AdminAccount;
using BackendAPI.Models.ClientAccount;

namespace BackendAPI.Interfaces.Client
{
    public interface IClientAccountService
    {
        public Task<ResponseToken> SignInAsync(SignInClientRequest model);
        public Task<ResponseToken> SignUpAsync(SignUpClientRequest model);
        public Task<Response> ChangePassWordAsync(ChangePassWordRequest model, string UserId);
        public Task<Response> UpdateInfoClientAsync(UpdateInfoClientRequest model, string UserId);
        public Task<Response> GetInfoClientAsync(string Id);
    }
}
