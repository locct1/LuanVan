using AutoMapper;
using BackendAPI.Data;
using BackendAPI.DTO.Admin;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ColorProduct;
using BackendAPI.Models.Product;
using BackendAPI.Models.ProductSample;
using BackendAPI.Services;
using BackendAPI.UnitOfWorks;
using MailKit.Search;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BackendAPI.Controllers
{
    [Route("api/product-samples")]
    [ApiController]
    public class ProductSampleController : ControllerBase
    {
        private readonly IProductSampleService _productSampleService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IProductVersionService _productVersionService;
        private readonly IProductColorProductService _productColorProductService;
        private readonly IMapper _mapper;

        public ProductSampleController(IProductSampleService productSampleService, IUnitOfWork unitOfWork, IPhotoService photoService, IProductVersionService productVersionService, IProductColorProductService productColorProductService, IMapper mapper)
        {
            _productSampleService = productSampleService;
            _unitOfWork = unitOfWork;
            _photoService = photoService;
            _productVersionService = productVersionService;
            _productColorProductService = productColorProductService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProductSamples(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var productSamples = await _productSampleService.GetAll();
                    var data = _mapper.Map<List<AdminProductSampleModel>>(productSamples);
                    return Ok(new Response
                    {
                        Data = data,
                        Success = true,

                    });
                }
                else
                {
                    var suppliers = await _productSampleService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = suppliers,
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
        [HttpGet("get-all-photos-by-product-id/{id}")]
        public async Task<IActionResult> GetAllPhotosByProductId(int id)
        {
            try
            {

                var photos = await _photoService.GetAllPhotosByProductId(id);
                return Ok(new Response
                {
                    Data = photos,
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
            }
        }
        [HttpPost("upload-default-image")]
        public async Task<IActionResult> UploadProductSamppleDefaulImage([FromForm] UploadProductSampleDefaultImageRequest model)
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
                var productColorProduct = await _productColorProductService.GetProductColorProductById(model.Id);
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
                var fileTemp = Path.Combine("Uploads", "ProductColorProduct", file1);

                using (var filestream = new FileStream(fileTemp, FileMode.Create))
                {
                    await model.Image.CopyToAsync(filestream);
                }
                productColorProduct.FileName = file1;
                await _productColorProductService.UpdateProductColorProduct(productColorProduct.Id, productColorProduct);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Upload thành công"
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
        [HttpDelete("delete-default-image/{id}")]
        public async Task<IActionResult> DeleteProductSampleDefaultImage(int id)
        {
            try
            {
                var findProductColorProduct = await _productColorProductService.GetProductColorProductById(id);
                if (findProductColorProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                var filename = "Uploads/ProductColorProduct/" + findProductColorProduct.FileName;
                if (!string.IsNullOrEmpty(findProductColorProduct.FileName))
                {
                    System.IO.File.Delete(filename);

                    findProductColorProduct.FileName = null;
                    await _productColorProductService.UpdateProductColorProduct(findProductColorProduct.Id, findProductColorProduct);
                    await _unitOfWork.SaveChangesAsync();
                }

                return Ok(new Response
                {
                    Success = true,
                    Message = "Xóa ảnh thành công"
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
        [HttpPost("upload-slide-image")]
        public async Task<IActionResult> UploadSlideProductSamppleImage([FromForm] UploadSlideProductSampleImageRequest model)
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

                if (model.Images.Count > 0)
                {
                    string[] departmentArray = { ".png", ".jpeg", ".jpg", ".webp" };
                    foreach (var f in model.Images)
                    {
                        string checkEntentions = Path.GetExtension(f.FileName).ToLower();

                        if (departmentArray.Contains(checkEntentions) == false)
                        {
                            return BadRequest(new Response
                            {
                                Success = false,
                                Message = "File không đúng định dạng",
                            });
                        }
                        var file1 = Path.GetFileNameWithoutExtension(Path.GetRandomFileName())
                    + Path.GetExtension(f.FileName);

                        var file = Path.Combine("Uploads", "ProductColorProduct", file1);

                        using (var filestream = new FileStream(file, FileMode.Create))
                        {
                            await f.CopyToAsync(filestream);
                        }
                        var photo = new Photo
                        {
                            FileName = file1,
                            ProductColorProductId = model.Id
                        };
                        await _photoService.CreatePhoto(photo);
                        await _unitOfWork.SaveChangesAsync();
                    }
                }
                return Ok(new Response
                {
                    Success = true,
                    Message = "Upload thành công"
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
        [HttpDelete("delete-slide-image/{id}")]
        public async Task<IActionResult> DeleteSlideProductSampleImage(int id)
        {
            try
            {
                var findPhoto = await _photoService.GetPhotoById(id);
                if (findPhoto is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                var filename = "Uploads/ProductColorProduct/" + findPhoto.FileName;
                System.IO.File.Delete(filename);
                await _photoService.DeletePhoto(findPhoto.Id);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Xóa ảnh thành công"
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



        [HttpPost("upload-image-product-360")]
        public async Task<IActionResult> UploadImageProduct360([FromForm] UploadImageProduct360Request model)
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

                if (model.Images.Count > 0)
                {
                    string[] departmentArray = { ".png", ".jpeg", ".jpg", ".webp" };
                    foreach (var f in model.Images)
                    {
                        string checkEntentions = Path.GetExtension(f.FileName).ToLower();

                        if (departmentArray.Contains(checkEntentions) == false)
                        {
                            return BadRequest(new Response
                            {
                                Success = false,
                                Message = "File không đúng định dạng",
                            });
                        }
                        var file1 = f.FileName;

                        var file = Path.Combine("Uploads", "ImageProduct360", file1);

                        using (var filestream = new FileStream(file, FileMode.Create))
                        {
                            await f.CopyToAsync(filestream);
                        }
                        var photo = new Photo
                        {
                            FileName = file1,
                            ProductId = model.Id
                        };
                        await _photoService.CreatePhoto(photo);
                        await _unitOfWork.SaveChangesAsync();
                    }
                }
                return Ok(new Response
                {
                    Success = true,
                    Message = "Upload thành công"
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
        [HttpDelete("delete-image-product-360/{id}")]
        public async Task<IActionResult> DeleteImageProduct360(int id)
        {
            try
            {
                var findPhoto = await _photoService.GetPhotoById(id);
                if (findPhoto is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                var filename = "Uploads/ImageProduct360/" + findPhoto.FileName;
                System.IO.File.Delete(filename);
                await _photoService.DeletePhoto(findPhoto.Id);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Xóa ảnh thành công"
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