using BackendAPI.Helpers;
using Microsoft.AspNetCore.Identity;

namespace BackendAPI.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<IdentityRole>> GetAll();
        Task<IdentityRole> GetRoleById(string id);
        Task<Response> CreateRole(IdentityRole newRole);
        Task<Response> UpdateRole(string id, IdentityRole updateRole);
        Task DeleteRole(string id);
    }
}
