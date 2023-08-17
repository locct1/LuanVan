using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BackendAPI.Services
{
    public class RoleService : IRoleService
    {
        private readonly ApplicationContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;

        private readonly UserManager<ApplicationUser> _userManager;

        public RoleService(RoleManager<IdentityRole> roleManager, ApplicationContext context, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _context = context;
            _userManager = userManager;
        }
        public async Task<Response> CreateRole(IdentityRole newRole)
        {
            var result = await _roleManager.CreateAsync(newRole);

            if (result.Succeeded)
            {
                return (new Response
                {
                    Success = true,
                    Message = "Thêm thành công"

                });
            }

            var errors = result.Errors.Select(e => e.Description).ToArray();
            return (new Response
            {
                Success = false,
                Errors = errors

            });
        }

        public async Task DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            await _roleManager.DeleteAsync(role);
        }



        public async Task<IEnumerable<IdentityRole>> GetAll()
        {
            var roles = await _roleManager.Roles.OrderBy(r => r.Name).ToListAsync();
            return roles;
        }

        public async Task<IdentityRole> GetRoleById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            return role;
        }

        public async Task<Response> UpdateRole(string id, IdentityRole updateRole)
        {
            var result = await _roleManager.UpdateAsync(updateRole);
            if (result.Succeeded)
            {
                return (new Response
                {
                    Success = true,
                    Message = "Thêm thành công"

                });
            }

            var errors = result.Errors.Select(e => e.Description).ToArray();
            return (new Response
            {
                Success = false,
                Errors = errors

            });
        }
    }
}
