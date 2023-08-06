using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.WareHouse;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/warehouses")]
    [ApiController]
    public class WareHouseController : ControllerBase
    {
        private readonly IWareHouseService _warehouseService;
        private readonly IUnitOfWork _unitOfWork;

        public WareHouseController(IWareHouseService warehouseService, IUnitOfWork unitOfWork)
        {
            _warehouseService = warehouseService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllWareHouses(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var warehouses = await _warehouseService.GetAll();
                    return Ok(new Response
                    {
                        Data = warehouses,
                        Success = true,

                    });
                }
                else
                {
                    var warehouses = await _warehouseService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = warehouses,
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
        public async Task<IActionResult> GetWareHouseById(int id)
        {
            try
            {
                WareHouse findWareHouse = await this._warehouseService.GetWareHouseById(id);
                if (findWareHouse is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findWareHouse,
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
        public async Task<IActionResult> CreateWareHouse(CreateWareHouseRequest model)
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
                WareHouse warehouse = new WareHouse
                {
                    Name = model.Name,
                    Address = model.Address,

                };
                await _warehouseService.CreateWareHouse(warehouse);
                await _unitOfWork.SaveChangesAsync();
                return CreatedAtAction(nameof(GetWareHouseById), new { id = warehouse.Id }, new Response
                {
                    Data = warehouse,
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
        public async Task<IActionResult> UpdateWareHouse(int id, UpdateWareHouseRequest model)
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
                if (id != model.Id)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });

                }
                WareHouse findWareHouse = await _warehouseService.GetWareHouseById(id);
                if (findWareHouse is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findWareHouse.Name = model.Name;
                findWareHouse.Address = model.Address;
                await _warehouseService.UpdateWareHouse(id, findWareHouse);
                await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetWareHouseById), new { id = findWareHouse.Id }, new Response
                {
                    Data = findWareHouse,
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWareHouse(int id)
        {
            try
            {
                WareHouse findWareHouse = await _warehouseService.GetWareHouseById(id);
                if (findWareHouse is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _warehouseService.DeleteWareHouse(findWareHouse.Id);
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
    }
}
