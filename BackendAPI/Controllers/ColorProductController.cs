using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ColorProduct;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/colorproducts")]
    [ApiController]
    public class ColorProductController : ControllerBase
    {
        private readonly IColorProductService _warehouseService;
        private readonly IUnitOfWork _unitOfWork;

        public ColorProductController(IColorProductService warehouseService, IUnitOfWork unitOfWork)
        {
            _warehouseService = warehouseService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllColorProducts(int page, int limit)
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
        public async Task<IActionResult> GetColorProductById(int id)
        {
            try
            {
                ColorProduct findColorProduct = await this._warehouseService.GetColorProductById(id);
                if (findColorProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findColorProduct,
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
        public async Task<IActionResult> CreateColorProduct(CreateColorProductRequest model)
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
                ColorProduct warehouse = new ColorProduct
                {
                    Name = model.Name,
                    CodeColor = model.CodeColor,

                };
                await _warehouseService.CreateColorProduct(warehouse);
                await _unitOfWork.SaveChangesAsync();
                return CreatedAtAction(nameof(GetColorProductById), new { id = warehouse.Id }, new Response
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
        public async Task<IActionResult> UpdateColorProduct(int id, UpdateColorProductRequest model)
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
                ColorProduct findColorProduct = await _warehouseService.GetColorProductById(id);
                if (findColorProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findColorProduct.Name = model.Name;
                findColorProduct.CodeColor = model.CodeColor;
                await _warehouseService.UpdateColorProduct(id, findColorProduct);
                await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetColorProductById), new { id = findColorProduct.Id }, new Response
                {
                    Data = findColorProduct,
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
        public async Task<IActionResult> DeleteColorProduct(int id)
        {
            try
            {
                ColorProduct findColorProduct = await _warehouseService.GetColorProductById(id);
                if (findColorProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _warehouseService.DeleteColorProduct(findColorProduct.Id);
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
