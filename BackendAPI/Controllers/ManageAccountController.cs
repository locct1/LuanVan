using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.AdminAccount;
using BackendAPI.Models.Brand;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace BackendAPI.Controllers
{
    [Route("api/manage-accounts")]
    [ApiController]
    public class ManageAccountController : ControllerBase
    {
        private readonly IManageAccountService _manageAccountService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;


        public ManageAccountController(IManageAccountService manageAccountService, IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _manageAccountService = manageAccountService;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var users = await _manageAccountService.GetAll();
                    return Ok(new Response
                    {
                        Data = users,
                        Success = true,

                    });
                }
                else
                {
                    var brands = await _manageAccountService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = brands,
                        Success = true,

                    });
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại sau" }
                });
            }
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                ApplicationUser findUser = await this._manageAccountService.GetUserById(id);
                if (findUser is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                var roles = await _userManager.GetRolesAsync(findUser);
                var userModel = new AccountViewModel
                {
                    // Thêm các thuộc tính khác của userModel
                    RoleNames = roles.ToList(),
                    Id = findUser.Id,
                    Email = findUser.Email,
                    PhoneNumber = findUser.PhoneNumber,
                    HouseNumberAndStreet = findUser.HouseNumberAndStreet,
                    WardCode = findUser.WardCode,
                    Disabled = findUser.Disabled,
                    DistrictID = findUser.DistrictID,
                    ProvinceID = findUser.ProvinceID,
                    FullName = findUser.FullName,
                    Address=findUser.Address
                };
                return Ok(new Response
                {
                    Data = userModel,
                    Success = true,

                });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại sau" }
                });
                throw;
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateAccountRequest model)
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

                var result = await _manageAccountService.CreateUser(model);
                if (!result.Success)
                {
                    return BadRequest(result);
                }
                return Ok(new Response
                {
                    Success = true,
                    Message = "Lưu thành công"

                });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại sau" }
                });
                throw;
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UpdateAccountRequest model)
        {
            try
            {
                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    if (!ModelState.IsValid)
                    {
                        var errors = ModelState.Values.SelectMany(v => v.Errors)
                                                      .Select(e => e.ErrorMessage)
                                                      .ToArray();
                        return BadRequest(new Response { Success = false, Errors = errors });
                    }

                    ApplicationUser findUser = await _manageAccountService.GetUserById(id);
                    if (findUser is null)
                    {
                        return BadRequest(new Response
                        {
                            Success = false,
                            Errors = new[] { "Không tìm thấy" }

                        });
                    }
                    var result = await _manageAccountService.UpdateUser(id, model);

                    if (!result.Success)
                    {
                        return BadRequest(result);
                    }
                    scope.Complete();
                    return Ok(result);
                }
            }
            catch (Exception)
            {

                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại sau" }
                });
                throw;
            }

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                ApplicationUser findUser = await _manageAccountService.GetUserById(id);
                if (findUser is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _manageAccountService.DeleteUser(findUser.Id);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Xóa thành công"
                });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại sau" }
                });
                throw;
            }

        }
        [HttpPut("change-status-user/{id}")]
        public async Task<IActionResult> ChangeStatusUser(string id)
        {
            try
            {
                ApplicationUser findUser = await _manageAccountService.GetUserById(id);
                if (findUser is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findUser.Disabled = !findUser.Disabled;
                await _manageAccountService.ChangeStatusAccount(findUser);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Đổi trạng thái thành công"
                });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại sau" }
                });
                throw;
            }

        }
    }
}
