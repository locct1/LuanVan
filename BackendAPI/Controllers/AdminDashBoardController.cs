using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BackendAPI.Controllers
{
    [Route("api/admin-dashboards")]
    [ApiController]
    public class AdminDashBoardsController : ControllerBase
    {
        private readonly IGetValueToken _getValueToken;
        private readonly IAdminDashBoardService _adminDashBoardService;
        public AdminDashBoardsController(IGetValueToken getValueToken, IAdminDashBoardService adminDashBoardService)
        {
            _getValueToken = getValueToken;
            _adminDashBoardService = adminDashBoardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var response = await _adminDashBoardService.GetAll();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Message = "Internal server error",
                });
                throw;
            }
        }
    }
}
