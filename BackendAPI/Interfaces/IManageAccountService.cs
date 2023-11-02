using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Models.AdminAccount;
using BackendAPI.Models.ClientAccount;
using System.Threading.Tasks;

namespace BackendAPI.Interfaces
{
    public interface IManageAccountService
    {
        Task<IEnumerable<AccountViewModel>> GetAll();
        Task<IEnumerable<ApplicationUser>> GetPagedList(int page, int limit);
        Task<ApplicationUser> GetUserById(string id);
        Task<Response> CreateUser(CreateAccountRequest user);
        Task<Response> UpdateUser(string id, UpdateAccountRequest user);
        Task<Response> DeleteUser(string id);
        Task ChangeStatusAccount(ApplicationUser model);

    }
}
