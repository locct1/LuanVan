using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ColorProduct;
using BackendAPI.Models.Product;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Linq;

namespace BackendAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IProductSampleService _productSampleService;
        private readonly IUnitOfWork _unitOfWork;



        public ProductController(IProductService productService, IProductSampleService productSampleService, IUnitOfWork unitOfWork)
        {
            _productService = productService;
            _productSampleService = productSampleService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var products = await _productService.GetAll();
                    return Ok(new Response
                    {
                        Data = products,
                        Success = true,

                    });
                }
                else
                {
                    var products = await _productService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = products,
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
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                Product findProduct = await this._productService.Get(id);
                if (findProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findProduct,
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
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductRequest model)
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
                var fileTemp = Path.Combine("Uploads", "Product", file1);

                using (var filestream = new FileStream(fileTemp, FileMode.Create))
                {
                    await model.Image.CopyToAsync(filestream);
                }
                List<CreateProductSampleRequest> colors =
                    JsonConvert.DeserializeObject<List<CreateProductSampleRequest>>(model.ColorProducts);

                Product product = new Product
                {
                    Name = model.Name,
                    BrandId = model.BrandId,
                    WareHouseId = model.WareHouseId,
                    PriceIn = model.PriceIn,
                    PriceOut = model.PriceOut,
                    Infomation = model.Infomation,
                    TechnicalDetail = model.TechnicalDetail,
                    Image = file1,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    Disabled = false

                };
                await _productService.CreateProduct(product);
                await _unitOfWork.SaveChangesAsync();
                foreach (var item in colors)
                {
                    ProductSample productSample = new ProductSample
                    {
                        ProductId = product.Id,
                        Name = product.Name + " (" + item.Label + ")",
                        ColorProductId = int.Parse(item.Value),
                        Quantity = 0,
                        Disabled = true,
                    };
                    await _productSampleService.CreateProductSample(productSample);
                    await _unitOfWork.SaveChangesAsync();
                }
                return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, new Response
                {
                    Data = product,
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
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductRequest model)
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
                Product findProduct = await _productService.Get(id);
                if (findProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                if (model.Image != null)
                {
                    var filename = "Uploads/Product/" + findProduct.Image;
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
                    var fileTemp = Path.Combine("Uploads", "Product", file1);

                    using (var filestream = new FileStream(fileTemp, FileMode.Create))
                    {
                        await model.Image.CopyToAsync(filestream);
                    }
                    findProduct.Image = file1;
                }
                findProduct.Name = model.Name;
                findProduct.BrandId = model.BrandId;
                findProduct.WareHouseId = model.WareHouseId;
                findProduct.PriceIn = model.PriceIn;
                findProduct.PriceOut = model.PriceOut;
                findProduct.Infomation = model.Infomation;
                findProduct.TechnicalDetail = model.TechnicalDetail;
                findProduct.UpdatedAt = DateTime.Now;
                await _productService.UpdateProduct(id, findProduct);
                await _unitOfWork.SaveChangesAsync();
                List<CreateProductSampleRequest> colors =
                   JsonConvert.DeserializeObject<List<CreateProductSampleRequest>>(model.ColorProducts);

                foreach (var item in findProduct.ProductSamples)
                {
                    bool isColorProductContained = colors.Any(color => int.Parse(color.Value) == item.ColorProductId);
                    if (!isColorProductContained)
                    {
                        await _productSampleService.DeleteProductSample(item.Id);
                    }
                    else
                    {
                        var colorToRemove = colors.FirstOrDefault(color => int.Parse(color.Value) == item.ColorProductId);
                        if (colorToRemove != null)
                        {
                            colors.Remove(colorToRemove);
                        }
                    }

                }
                foreach (var color in colors)
                {
                    ProductSample productSample = new ProductSample
                    {
                        ProductId = findProduct.Id,
                        Name = findProduct.Name + " (" + color.Label + ")",
                        ColorProductId = int.Parse(color.Value),
                        Quantity = 0,
                        Disabled = true,
                    };
                    await _productSampleService.CreateProductSample(productSample);
                }
                    await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductById), new { id = findProduct.Id }, new Response
                {
                    Data = findProduct,
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
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                Product findProduct = await _productService.GetProductById(id);
                if (findProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }

                await _productService.DeleteProduct(findProduct.Id);

                var filename = "Uploads/Product/" + findProduct.Image;
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
        [HttpPut("change-status-product/{id}")]
        public async Task<IActionResult> ChangeStatusProduct(int id)
        {
            try
            {
                Product findProduct = await _productService.GetProductById(id);
                if (findProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findProduct.Disabled = !findProduct.Disabled;
                findProduct.UpdatedAt = DateTime.Now;
                await _productService.UpdateProduct(id, findProduct);
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
