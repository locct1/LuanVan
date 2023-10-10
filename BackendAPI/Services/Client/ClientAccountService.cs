using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Interfaces.Client;
using BackendAPI.Models.AdminAccount;
using BackendAPI.Models.ClientAccount;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackendAPI.Services.Client
{
    public class ClientAccountService : IClientAccountService
    {
        private readonly ApplicationContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUnitOfWork _unitOfWork;
        public ClientAccountService(ApplicationContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager, IUnitOfWork unitOfWork)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _unitOfWork = unitOfWork;
        }

        public async Task<Response> ChangePassWordAsync(ChangePassWordRequest model, string UserId)
        {
            var user = await _unitOfWork.GetRepository<ApplicationUser>().GetByID(UserId);
            var result = await _signInManager.PasswordSignInAsync(user.Email, model.OldPassWord, false, false);
            if (!result.Succeeded)
            {
                return (new Response
                {
                    Success = false,
                    Errors = new[] { "Mật khẩu cũ không đúng" },
                });
            }
            // Thay đổi mật khẩu mới bằng cách sử dụng UserManager
            var resultPassWord = await _userManager.ChangePasswordAsync(user, model.OldPassWord, model.NewPassWord);
            if (!resultPassWord.Succeeded)
            {
                List<IdentityError> errorList = resultPassWord.Errors.ToList();
                string[] errorsArray = errorList.Select(e => e.Description).ToArray();
                return new Response
                {
                    Success = false,
                    Errors = errorsArray,
                };
            }

            // Cập nhật mật khẩu trong trường hợp thay đổi mật khẩu thành công
            await _userManager.UpdateAsync(user);

            return new Response
            {
                Success = true,
                Message = "Thay đổi mật khẩu thành công"
            };
        }

        public async Task<Response> GetInfoClientAsync(string Id)
        {
            var user = await _unitOfWork.GetRepository<ApplicationUser>().GetByID(Id);
            return (new Response
            {
                Success = true,
                Message = "Thành công",
                Data = user

            });
        }

        public async Task<ResponseToken> SignInAsync(SignInClientRequest model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (!result.Succeeded)
            {
                return (new ResponseToken
                {
                    Success = false,
                    Errors = new[] { "Email hoặc mật khẩu không đúng" },
                    AccessToken = null
                });
            }
            var user = await _userManager.FindByNameAsync(model.Email);
            var roles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>();
            authClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            authClaims.Add(new Claim("Email", user.Email));
            authClaims.Add(new Claim("FullName", user.FullName));
            authClaims.Add(new Claim("Id", user.Id));
            foreach (var role in roles)
            {
                authClaims.Add(new Claim("role", role));
            }

            var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(20),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha512Signature)
            );
            return (new ResponseToken
            {
                Success = true,
                Message = "Thành công",
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }

        public async Task<ResponseToken> SignUpAsync(SignUpClientRequest model)
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
            await _userManager.AddToRoleAsync(createUser, "Admin");
            if (!result.Succeeded)
            {
                List<IdentityError> errorList = result.Errors.ToList();
                string[] errorsArray = errorList.Select(e => e.Description).ToArray();
                return (new ResponseToken
                {
                    Success = false,
                    Errors = errorsArray,
                });

            }
            var resultRole = await _userManager.AddToRoleAsync(createUser, "Client");

            if (!resultRole.Succeeded)
            {

                List<IdentityError> errorList = result.Errors.ToList();
                string[] errorsArray = errorList.Select(e => e.Description).ToArray();
                return (new ResponseToken
                {
                    Success = false,
                    Errors = errorsArray,
                });

            }
            else
            {
                var user = await _userManager.FindByNameAsync(model.Email);
                var roles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>();
                authClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
                authClaims.Add(new Claim("Email", user.Email));
                authClaims.Add(new Claim("FullName", user.FullName));
                authClaims.Add(new Claim("Id", user.Id));
                foreach (var role in roles)
                {
                    authClaims.Add(new Claim("role", role));
                }

                var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddDays(20),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha512Signature)
                );
                return (new ResponseToken
                {
                    Success = true,
                    Message = "Thành công",
                    AccessToken = new JwtSecurityTokenHandler().WriteToken(token)
                });
            }
        }

        public async Task<Response> UpdateInfoClientAsync(UpdateInfoClientRequest model, string UserId)
        {
            var user = await _unitOfWork.GetRepository<ApplicationUser>().GetByID(UserId);
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
    }
}
