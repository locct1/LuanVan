using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.Brand;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/brands")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;
        private readonly IUnitOfWork _unitOfWork;

        public BrandController(IBrandService brandService, IUnitOfWork unitOfWork)
        {
            _brandService = brandService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllBrands(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var brands = await _brandService.GetAll();
                    return Ok(new Response
                    {
                        Data = brands,
                        Success = true,

                    });
                }
                else
                {
                    var brands = await _brandService.GetPagedList(page, limit);
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
        public async Task<IActionResult> GetBrandById(int id)
        {
            try
            {
                Brand findBrand = await this._brandService.GetBrandById(id);
                if (findBrand is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findBrand,
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
        public async Task<IActionResult> CreateBrand([FromForm] CreateBrandRequest model)
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
                string[] departmentArray = { ".png", ".jpeg", ".jpg", ".webp" };
                string checkEntentions = Path.GetExtension(model.Image.FileName).ToLower();

                if (departmentArray.Contains(checkEntentions) == false)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "File không đúng định dạng" }
                    });
                }
                var file1 = Path.GetFileNameWithoutExtension(Path.GetRandomFileName())
            + Path.GetExtension(model.Image.FileName);
                var fileTemp = Path.Combine("Uploads", "Brand", file1);

                using (var filestream = new FileStream(fileTemp, FileMode.Create))
                {
                    await model.Image.CopyToAsync(filestream);
                }
                Brand brand = new Brand
                {
                    Name = model.Name,
                    Image = file1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    Disabled = false

                };
                await _brandService.CreateBrand(brand);
                await _unitOfWork.SaveChangesAsync();
                return CreatedAtAction(nameof(GetBrandById), new { id = brand.Id }, new Response
                {
                    Data = brand,
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
        public async Task<IActionResult> UpdateBrand(int id, [FromForm] UpdateBrandRequest model)
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
                Brand findBrand = await _brandService.GetBrandById(id);
                if (findBrand is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                if (model.Image != null)
                {
                    var filename = "Uploads/Brand/" + findBrand.Image;
                    System.IO.File.Delete(filename);
                    string[] departmentArray = { ".png", ".jpeg", ".jpg", ".webp" };
                    string checkEntentions = Path.GetExtension(model.Image.FileName).ToLower();

                    if (departmentArray.Contains(checkEntentions) == false)
                    {
                        return BadRequest(new Response
                        {
                            Success = false,
                            Errors = new[] { "File không đúng định dạng" }
                        });
                    }
                    var file1 = Path.GetFileNameWithoutExtension(Path.GetRandomFileName())
                + Path.GetExtension(model.Image.FileName);
                    var fileTemp = Path.Combine("Uploads", "Brand", file1);

                    using (var filestream = new FileStream(fileTemp, FileMode.Create))
                    {
                        await model.Image.CopyToAsync(filestream);
                    }
                    findBrand.Image = file1;
                }
                findBrand.Name = model.Name;
                findBrand.UpdatedAt = DateTime.Now;
                await _brandService.UpdateBrand(id, findBrand);
                await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBrandById), new { id = findBrand.Id }, new Response
                {
                    Data = findBrand,
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
        public async Task<IActionResult> DeleteBrand(int id)
        {
            try
            {
                Brand findBrand = await _brandService.GetBrandById(id);
                if (findBrand is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _brandService.DeleteBrand(findBrand.Id);
                var filename = "Uploads/Brand/" + findBrand.Image;
                System.IO.File.Delete(filename);
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
        [HttpPut("change-status-brand/{id}")]
        public async Task<IActionResult> ChangeStatusBrand(int id)
        {
            try
            {
                Brand findBrand = await _brandService.GetBrandById(id);
                if (findBrand is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
               findBrand.Disabled = !findBrand.Disabled;
                findBrand.UpdatedAt=DateTime.Now;
                await _brandService.UpdateBrand(id, findBrand);
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
