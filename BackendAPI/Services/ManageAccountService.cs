using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.AdminAccount;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;

namespace BackendAPI.Services
{
    public class ManageAccountService : IManageAccountService

    {
        private readonly ApplicationContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUnitOfWork _unitOfWork;

        public ManageAccountService(ApplicationContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager, IUnitOfWork unitOfWork)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AccountViewModel>> GetAll()
        {
            var users = await _unitOfWork.GetRepository<ApplicationUser>().GetAll();
            List<AccountViewModel> model = new List<AccountViewModel>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userModel = new AccountViewModel
                {
                    // Thêm các thuộc tính khác của userModel
                    RoleNames = roles.ToList(),
                    Id = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    HouseNumberAndStreet = user.HouseNumberAndStreet,
                    WardCode = user.WardCode,
                    Disabled = user.Disabled,
                    DistrictID = user.DistrictID,
                    ProvinceID = user.ProvinceID,
                    FullName = user.FullName
                };

                model.Add(userModel);
            }
            return model;
        }
        public async Task<IEnumerable<ApplicationUser>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<ApplicationUser>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<ApplicationUser?> GetUserById(string id)
        {
            return await _unitOfWork.GetRepository<ApplicationUser>().GetByID(id);

        }

        public async Task<Response> CreateUser(CreateAccountRequest model)
        {
            var createUser = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                Address = model.FullAddress,
                Disabled = false,
                FullName = model.FullName,
                DistrictID = model.DistrictID,
                WardCode = model.WardCode,
                ProvinceID = model.ProvinceID,
                HouseNumberAndStreet = model.HouseNumberAndStreet,

            };
            var result = await _userManager.CreateAsync(createUser, model.Password);
            var resultRole = await _userManager.AddToRoleAsync(createUser, "Admin");
            if (!result.Succeeded)
            {
                List<IdentityError> errorList = result.Errors.ToList();
                string[] errorsArray = errorList.Select(e => e.Description).ToArray();
                return (new Response
                {
                    Success = false,
                    Errors = errorsArray,
                });

            }
            if (!resultRole.Succeeded)
            {

                List<IdentityError> errorList = result.Errors.ToList();
                string[] errorsArray = errorList.Select(e => e.Description).ToArray();
                return (new Response
                {
                    Success = false,
                    Errors = errorsArray,
                });

            }
            return (new Response
            {
                Success = true,
                Message = "Thành công",
                Data = createUser
            }); ;
        }
        public async Task<Response> UpdateUser(string id, UpdateAccountRequest model)
        {
            var user = await _unitOfWork.GetRepository<ApplicationUser>().GetByID(id);

            ApplicationUser userRole = await _userManager.FindByIdAsync(id);
            var OldRoleNames = (await _userManager.GetRolesAsync(userRole)).ToArray();
            var deleteRoles = OldRoleNames.Where(r => !model.RoleNames.Contains(r));
            var addRoles = model.RoleNames.Where(r => !OldRoleNames.Contains(r));
            List<string> roleNames = await _roleManager.Roles.Select(r => r.Name).ToListAsync();
            var resultDelete = await _userManager.RemoveFromRolesAsync(userRole, deleteRoles);
            if (!resultDelete.Succeeded)
            {
                return (new Response
                {
                    Message = "Error",
                    Success = false,
                });
            }
            var resultAdd = await _userManager.AddToRolesAsync(user, addRoles);
            if (!resultAdd.Succeeded)
            {
                return (new Response
                {
                    Message = "Error",
                    Success = false,
                });
            }


            user.PhoneNumber = model.PhoneNumber;
            user.Address = model.Address;
            user.FullName = model.FullName;
            user.ProvinceID = model.ProvinceID;
            user.DistrictID = model.DistrictID;
            user.WardCode = model.WardCode;
            user.HouseNumberAndStreet = model.HouseNumberAndStreet;
            await _userManager.UpdateAsync(user);

            return (new Response
            {
                Success = true,
                Message = "Cập nhật thông tin thành công"
            });
        }
        public async Task<Response> DeleteUser(string id)
        {
            await _unitOfWork.GetRepository<ApplicationUser>().Delete(id);
            return (new Response
            {
                Success = true,
                Message = "Cập nhật thông tin thành công"
            });
        }

        public async Task ChangeStatusAccount(ApplicationUser model)
        {
            await _userManager.UpdateAsync(model);
        }
    }
}
