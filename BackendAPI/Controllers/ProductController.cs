using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ColorProduct;
using BackendAPI.Models.Product;
using BackendAPI.Models.ProductVersion;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Drawing;
using System.Linq;
using System.Transactions;

namespace BackendAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IProductSampleService _productSampleService;
        private readonly IProductVersionService _productVersionService;
        private readonly IProductColorProductService _productColorProductService;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _unitOfWork;

        public ProductController(IProductService productService, IProductSampleService productSampleService, IProductVersionService productVersionService, IProductColorProductService productColorProductService, IPhotoService photoService, IUnitOfWork unitOfWork)
        {
            _productService = productService;
            _productSampleService = productSampleService;
            _productVersionService = productVersionService;
            _productColorProductService = productColorProductService;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts(int page, int limit)
        {
            try
            {

                var products = await _productService.GetAll();
                return Ok(new Response
                {
                    Data = products,
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
                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
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

                    List<CreateProductVersionRequest> createProductVersions =
                      JsonConvert.DeserializeObject<List<CreateProductVersionRequest>>(model.ProductVersionList);

                    Product product = new Product
                    {
                        Name = model.Name,
                        BrandId = model.BrandId,
                        WareHouseId = model.WareHouseId,
                        Infomation = model.Infomation,
                        Image = file1,
                        IsVersionRam = model.IsVersionRam,
                        Resolution = model.Resolution,
                        ScreenWidth = model.ScreenWidth,
                        FrontCamera = model.FrontCamera,
                        RearCamera = model.RearCamera,
                        Battery = model.Battery,
                        Sim = model.Sim,
                        Charging = model.Charging,
                        ScreenTechnologyId = model.ScreenTechnologyId,
                        ChipId = model.ChipId,
                        OperatingSystemProductId = model.OperatingSystemId,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        Disabled = false,
                    };
                    await _productService.CreateProduct(product);
                    await _unitOfWork.SaveChangesAsync();
                    foreach (var item in createProductVersions)
                    {
                        ProductVersion productVersion = new ProductVersion
                        {
                            RamId = item.RamId,
                            ProductId = product.Id,
                            RomId = item.RomId,
                            PriceIn = item.PriceIn,
                            PriceOut = item.PriceOut,
                        };
                        await _productVersionService.CreateProductVersion(productVersion);
                        await _unitOfWork.SaveChangesAsync();
                        foreach (var color in colors)
                        {
                            ProductSample productSample = new ProductSample
                            {
                                ColorProductId = int.Parse(color.Value),
                                ProductVersionId = productVersion.Id,
                                Quantity = 0,
                                Disabled = true,
                            };

                            await _productSampleService.CreateProductSample(productSample);
                            await _unitOfWork.SaveChangesAsync();
                        }
                    }
                    foreach (var color in colors)
                    {
                        ProductColorProduct productColorProduct = new ProductColorProduct
                        {
                            ColorProductId = int.Parse(color.Value),
                            ProductId = product.Id,
                        };
                        await _productColorProductService.CreateProductColorProduct(productColorProduct);
                        await _unitOfWork.SaveChangesAsync();
                    }
                    scope.Complete();
                    return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, new Response
                    {
                        Data = product,
                        Success = true,
                        Message = "Lưu thành công"

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
                throw;
            }

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductRequest model)
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
                    findProduct.Infomation = model.Infomation;
                    findProduct.IsVersionRam = model.IsVersionRam;
                    findProduct.Resolution = model.Resolution;
                    findProduct.ScreenWidth = model.ScreenWidth;
                    findProduct.FrontCamera = model.FrontCamera;
                    findProduct.RearCamera = model.RearCamera;
                    findProduct.Battery = model.Battery;
                    findProduct.Sim = model.Sim;
                    findProduct.Charging = model.Charging;
                    findProduct.ScreenTechnologyId = model.ScreenTechnologyId;
                    findProduct.ChipId = model.ChipId;
                    findProduct.OperatingSystemProductId = model.OperatingSystemProductId;

                    findProduct.UpdatedAt = DateTime.Now;
                    await _productService.UpdateProduct(id, findProduct);
                    await _unitOfWork.SaveChangesAsync();
                    List<CreateProductSampleRequest> colors =
                       JsonConvert.DeserializeObject<List<CreateProductSampleRequest>>(model.ColorProducts);
                    List<UpdateProductVersionRequest> updateProductVersions =
                         JsonConvert.DeserializeObject<List<UpdateProductVersionRequest>>(model.ProductVersionList);
                    foreach (var item in updateProductVersions)
                    {
                        if (item.Id != null)
                        {
                            int idValue = item.Id.Value;
                            ProductVersion productVersion = await _productVersionService.GetProductVersionById(idValue);
                            if (productVersion != null)
                            {
                                productVersion.PriceOut = item.PriceOut;
                                productVersion.PriceIn = item.PriceIn;
                                productVersion.RamId = item.RamId;
                                productVersion.RomId = item.RomId;
                                await _productVersionService.UpdateProductVersion(productVersion.Id, productVersion);
                                await _unitOfWork.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            ProductVersion productVersion = new ProductVersion
                            {
                                RamId = item.RamId,
                                ProductId = findProduct.Id,
                                RomId = item.RomId,
                                PriceIn = item.PriceIn,
                                PriceOut = item.PriceOut,
                            };

                            await _productVersionService.CreateProductVersion(productVersion);
                            await _unitOfWork.SaveChangesAsync();
                            List<ProductColorProduct> productColorProducts = findProduct.ProductColorProducts.ToList();
                            foreach (var item1 in productColorProducts)
                            {
                                ProductSample productSample = new ProductSample
                                {
                                    ColorProductId = item1.ColorProductId,
                                    ProductVersionId = productVersion.Id,
                                    Quantity = 0,
                                    Disabled = true,
                                };

                                await _productSampleService.CreateProductSample(productSample);
                                await _unitOfWork.SaveChangesAsync();
                            }
                        }

                    }
                    List<ProductVersion> productVersions = findProduct.ProductVersions.ToList();
                    foreach (var item in findProduct.ProductColorProducts.ToList())
                    {
                        bool isColorProductContained = colors.Any(color => int.Parse(color.Value) == item.ColorProductId);
                        if (!isColorProductContained)
                        {
                            await _productColorProductService.DeleteProductColorProduct(item.Id);
                            foreach (var item1 in productVersions)
                            {
                                int colorProductId = item.ColorProductId.HasValue ? item.ColorProductId.Value : 0; // Trích xuất giá trị từ int?
                                ProductSample productSample = await _productSampleService.GetProductSampleByProductVersionAndColorProduct(item1.Id, colorProductId);
                                if (productSample != null)
                                {
                                    await _productSampleService.DeleteProductSample(productSample.Id);
                                    await _unitOfWork.SaveChangesAsync();
                                }
                            }
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
                        ProductColorProduct productColorProduct = new ProductColorProduct
                        {
                            ProductId = findProduct.Id,
                            ColorProductId = int.Parse(color.Value),
                        };
                        foreach (var item1 in productVersions)
                        {
                            ProductSample productSample = new ProductSample
                            {
                                ColorProductId = int.Parse(color.Value),
                                ProductVersionId = item1.Id,
                                Quantity = 0,
                                Disabled = true,
                            };

                            await _productSampleService.CreateProductSample(productSample);
                            await _unitOfWork.SaveChangesAsync();

                        }
                        await _productColorProductService.CreateProductColorProduct(productColorProduct);

                    }
                    await _unitOfWork.SaveChangesAsync();
                    scope.Complete();
                    return CreatedAtAction(nameof(GetProductById), new { id = findProduct.Id }, new Response
                    {
                        Data = findProduct,
                        Success = true,
                        Message = "Lưu thành công"

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
                throw;
            }

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {

                    Product findProduct = await _productService.Get(id);
                    if (findProduct is null)
                    {
                        return BadRequest(new Response
                        {
                            Success = false,
                            Errors = new[] { "Không tìm thấy" }

                        });
                    }
                    foreach (var item in findProduct.ProductVersions)
                    {
                        await _productVersionService.DeleteProductVersion(item.Id);
                        var productSamples = await _productSampleService.GetAllProductSamplesByProductVersion(item.Id);
                        foreach (var item1 in productSamples)
                        {
                            await _productSampleService.DeleteProductSample(item1.Id);
                        }
                        await _productVersionService.DeleteProductVersion(item.Id);
                    }
                    foreach (var item in findProduct.ProductColorProducts)
                    {
                        var photos = await _photoService.GetAllPhotosByProductColorProductId(item.Id);
                        foreach (var item1 in photos)
                        {
                            await _photoService.DeletePhoto(item1.Id);
                        }
                        await _productColorProductService.DeleteProductColorProduct(item.Id);
                    }
                    var filename = "Uploads/Product/" + findProduct.Image;
                    System.IO.File.Delete(filename);
                    await _productService.DeleteProduct(findProduct.Id);

                    await _unitOfWork.SaveChangesAsync();
                    scope.Complete();

                    return Ok(new Response
                    {
                        Success = true,
                        Message = "Xóa thành công"
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
                throw;
            }

        }
        [HttpDelete("delete-product-version/{id}")]
        public async Task<IActionResult> DeleteProductVersion(int id)
        {
            try
            {
                using (var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    ProductVersion findProductVersion = await _productVersionService.GetProductVersionById(id);
                    var ProductSamples = await _productSampleService.GetAllProductSamplesByProductVersion(findProductVersion.Id);
                    foreach (var item in ProductSamples)
                    {
                        await _productSampleService.DeleteProductSample(item.Id);
                        await _unitOfWork.SaveChangesAsync();
                    }
                    if (findProductVersion is null)
                    {
                        return BadRequest(new Response
                        {
                            Success = false,
                            Errors = new[] { "Không tìm thấy" }

                        });
                    }

                    await _productVersionService.DeleteProductVersion(findProductVersion.Id);

                    await _unitOfWork.SaveChangesAsync();
                    scope.Complete();

                    return Ok(new Response
                    {
                        Success = true,
                        Message = "Xóa thành công"
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
        [HttpGet("get-all-rams")]

        public async Task<IActionResult> GetAllRams()
        {
            try
            {

                var rams = await _productService.GetAllRams();
                return Ok(new Response
                {
                    Data = rams,
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
        [HttpGet("get-all-roms")]
        public async Task<IActionResult> GetAllRoms()
        {
            try
            {

                var roms = await _productService.GetAllRoms();
                return Ok(new Response
                {
                    Data = roms,
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
        [HttpGet("get-all-chip-types")]
        public async Task<IActionResult> GetAllChipTypes()
        {
            try
            {

                var chipTypes = await _productService.GetAllChipTypes();
                return Ok(new Response
                {
                    Data = chipTypes,
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
        [HttpGet("get-all-chips")]
        public async Task<IActionResult> GetAllChips()
        {
            try
            {

                var chips = await _productService.GetAllChips();
                return Ok(new Response
                {
                    Data = chips,
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
        [HttpGet("get-all-operating-systems-types")]
        public async Task<IActionResult> GetAllOperatingSystemTypes()
        {
            try
            {

                var operatingSystemTypes = await _productService.GetAllOpertingSystemTypes();
                return Ok(new Response
                {
                    Data = operatingSystemTypes,
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
        [HttpGet("get-all-operating-systems")]
        public async Task<IActionResult> GetAllOperatingSystems()
        {
            try
            {

                var chips = await _productService.GetAllOpertingSystems();
                return Ok(new Response
                {
                    Data = chips,
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
        [HttpGet("get-all-screen-technologies")]
        public async Task<IActionResult> GetAllScreenTechnologies()
        {
            try
            {

                var chips = await _productService.GetAllScreenTechnologies();
                return Ok(new Response
                {
                    Data = chips,
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
    }
}
