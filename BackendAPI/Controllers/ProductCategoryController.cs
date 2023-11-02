using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ProductCategory;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/product-categories")]
    [ApiController]
    public class ProductCategoryController : ControllerBase
    {
        private readonly IProductCategoryService _warehouseService;
        private readonly IUnitOfWork _unitOfWork;

        public ProductCategoryController(IProductCategoryService warehouseService, IUnitOfWork unitOfWork)
        {
            _warehouseService = warehouseService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProductCategorys(int page, int limit)
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
        public async Task<IActionResult> GetProductCategoryById(int id)
        {
            try
            {
                ProductCategory findProductCategory = await this._warehouseService.GetProductCategoryById(id);
                if (findProductCategory is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findProductCategory,
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
        public async Task<IActionResult> CreateProductCategory(CreateProductCategoryRequest model)
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
                ProductCategory warehouse = new ProductCategory
                {
                    Name = model.Name,
                    Code = model.Code,
                };
                await _warehouseService.CreateProductCategory(warehouse);
                await _unitOfWork.SaveChangesAsync();
                return CreatedAtAction(nameof(GetProductCategoryById), new { id = warehouse.Id }, new Response
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
        public async Task<IActionResult> UpdateProductCategory(int id, UpdateProductCategoryRequest model)
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
                ProductCategory findProductCategory = await _warehouseService.GetProductCategoryById(id);
                if (findProductCategory is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findProductCategory.Name = model.Name;
                findProductCategory.Code = model.Code;
                await _warehouseService.UpdateProductCategory(id, findProductCategory);
                await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductCategoryById), new { id = findProductCategory.Id }, new Response
                {
                    Data = findProductCategory,
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
        public async Task<IActionResult> DeleteProductCategory(int id)
        {
            try
            {
                ProductCategory findProductCategory = await _warehouseService.GetProductCategoryById(id);
                if (findProductCategory is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _warehouseService.DeleteProductCategory(findProductCategory.Id);
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
