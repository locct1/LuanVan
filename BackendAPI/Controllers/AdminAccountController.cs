using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.AdminAccount;
using BackendAPI.Models.Brand;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BackendAPI.Controllers
{
    [Route("api/admin-accounts")]
    [ApiController]
    public class AdminAccountController : ControllerBase
    {
        private readonly IBrandService _brandService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGetValueToken _getValueToken;
        private readonly IAdminAccountService _adminAccountService;

        public AdminAccountController(IBrandService brandService, IUnitOfWork unitOfWork, IGetValueToken getValueToken, IAdminAccountService adminAccountService)
        {
            _brandService = brandService;
            _unitOfWork = unitOfWork;
            _getValueToken = getValueToken;
            _adminAccountService = adminAccountService;
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn(SignInAdminModel signInAdminModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                                                  .Select(e => e.ErrorMessage)
                                                  .ToArray();
                    return BadRequest(new Response { Success = false, Errors = errors });
                }
                var result = await _adminAccountService.SignInAsync(signInAdminModel);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Message = "Internal server error",
                });
            }
        }
        [HttpGet("get-info-admin")]
       [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetInfoAdmin()
        {
            try
            {
                //var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                var result = await _adminAccountService.GetInfoAdminAsync(Id);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Message = "Internal server error",
                });

            }

        }
    }
}
