using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Models.AdminAccount;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using System.Security.Cryptography;

namespace BackendAPI.Services
{
    public class AdminAccountService : IAdminAccountService
    {
        private readonly ApplicationContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUnitOfWork _unitOfWork;
        public AdminAccountService(ApplicationContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, RoleManager<IdentityRole> roleManager, IUnitOfWork unitOfWork)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _unitOfWork = unitOfWork;
        }
        public async Task<Response> GetInfoAdminAsync(string Id)
        {
            var user = await _unitOfWork.GetRepository<ApplicationUser>().GetByID(Id);
            return (new Response
            {
                Success = true,
                Message = "Thành công",
                Data = user

            });
        }
        public async Task<ResponseToken> SignInAsync(SignInAdminModel model)
        {
            
            //IdentityRole roleAdmin = new IdentityRole
            //{
            //    Name = "Admin",
            //};
            //IdentityRole roleClient = new IdentityRole
            //{
            //    Name = "Client",
            //};
            //await _roleManager.CreateAsync(roleAdmin);
            //await _roleManager.CreateAsync(roleClient);
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (!result.Succeeded)
            {
                return (new ResponseToken
                {
                    Success = false,
                    Message = "Email hoặc mật khẩu không đúng",
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
                if (role == "CLient")
                {
                    return (new ResponseToken
                    {
                        Success = false,
                        Message = "Bạn không có quyền truy cập vào trang này",
                        AccessToken = null
                    });
                }
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
}
