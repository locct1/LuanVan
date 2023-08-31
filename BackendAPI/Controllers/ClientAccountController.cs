using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Interfaces.Client;
using BackendAPI.Models.AdminAccount;
using BackendAPI.Models.ClientAccount;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BackendAPI.Controllers
{
    [Route("api/client-accounts")]
    [ApiController]
    public class ClientAccountController : ControllerBase
    {
        private readonly IBrandService _brandService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGetValueToken _getValueToken;
        private readonly IClientAccountService _clientAccountService;

        public ClientAccountController(IBrandService brandService, IUnitOfWork unitOfWork, IGetValueToken getValueToken, IClientAccountService clientAccountService)
        {
            _brandService = brandService;
            _unitOfWork = unitOfWork;
            _getValueToken = getValueToken;
            _clientAccountService = clientAccountService;
        }

        [HttpPost("signin-client")]
        public async Task<IActionResult> SignIn(SignInClientRequest signInClientModel)
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
                var result = await _clientAccountService.SignInAsync(signInClientModel);

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

        [HttpPost("signup-client")]
        public async Task<IActionResult> SignUp(SignUpClientRequest signUpClientModel)
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
                var result = await _clientAccountService.SignUpAsync(signUpClientModel);

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
        [HttpPost("change-password-client")]
        [Authorize]
        public async Task<IActionResult> ChangePassWordClient(ChangePassWordRequest model)
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
                var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                var result = await _clientAccountService.ChangePassWordAsync(model, Id);

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
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại trong giây lát." }
                });
            }
        }
        [HttpPost("update-info-client")]
        [Authorize]
        public async Task<IActionResult> UpdateInfoClient(UpdateInfoClientRequest model)
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
                var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                var result = await _clientAccountService.UpdateInfoClientAsync(model, Id);

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
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại trong giây lát." }

                });
            }
        }
        [HttpGet("get-info-client")]
        [Authorize]
        public async Task<IActionResult> GetInfoClient()
        {
            try
            {
                //var accessToken = Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                var result = await _clientAccountService.GetInfoClientAsync(Id);

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
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại trong giây lát." }
                });

            }

        }
    }
}
