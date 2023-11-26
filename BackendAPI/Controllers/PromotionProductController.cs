using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.PromotionProduct;
using BackendAPI.Services;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace BackendAPI.Controllers
{
    [Route("api/promotion-products")]
    [ApiController]
    public class PromotionProductController : ControllerBase
    {
        private readonly IPromotionProductService _promotionProductService;
        private readonly IPromotionProductDetailService _promotionProductDetailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductSampleService _productSampleService;

        public PromotionProductController(IPromotionProductService promotionProductService, IPromotionProductDetailService promotionProductDetailService, IUnitOfWork unitOfWork, IProductSampleService productSampleService)
        {
            _promotionProductService = promotionProductService;
            _promotionProductDetailService = promotionProductDetailService;
            _unitOfWork = unitOfWork;
            _productSampleService = productSampleService;
        }

        [HttpGet("get-all-products")]
        public async Task<IActionResult> GetAllProducts(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var products = await _promotionProductService.GetAllProducts();
                    return Ok(new Response
                    {
                        Data = products,
                        Success = true,
                    });
                }
                else
                {
                    var products = await _promotionProductService.GetAllProducts();

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
        [HttpGet]

        public async Task<IActionResult> GetAllPromotionProducts(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var promotionProducts = await _promotionProductService.GetAll();
                    return Ok(new Response
                    {
                        Data = promotionProducts,
                        Success = true,

                    });
                }
                else
                {
                    var promotionProducts = await _promotionProductService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = promotionProducts,
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
        public async Task<IActionResult> GetPromotionProductById(int id)
        {
            try
            {
                PromotionProduct findPromotionProduct = await this._promotionProductService.GetPromotionProductById(id);
                if (findPromotionProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findPromotionProduct,
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
        public async Task<IActionResult> CreatePromotionProduct(CreatePromotionProductRequest model)
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
                    TimeSpan gmt7Offset = TimeSpan.FromHours(7);

                    DateTime adjustedStartDate = model.StartDate + gmt7Offset;
                    DateTime adjustedEndDate = model.EndDate + gmt7Offset;
                    PromotionProduct promotionProduct = new PromotionProduct
                    {
                        Name = model.Name,
                        StartDate = adjustedStartDate,
                        EndDate = adjustedEndDate,
                        Disabled = true,
                    };
                    await _promotionProductService.CreatePromotionProduct(promotionProduct);
                    await _unitOfWork.SaveChangesAsync();
                    foreach (var item in model.ListPromotionProducts)
                    {
                        var listProductSamples = await _productSampleService.GetAllProductSamplesByProductVersion(item.ProductVersionId);
                        foreach (var item1 in listProductSamples)
                        {
                            PromotionProductDetail promotionProductDetail = new PromotionProductDetail
                            {
                                ProductVersionId = item.ProductVersionId,
                                DiscountedPrice = item.DiscountedPrice,
                                PromotionProductId = promotionProduct.Id,
                                ColorProductId = item1.ColorProductId,
                            };
                            await _promotionProductDetailService.CreatePromotionProductDetail(promotionProductDetail);

                        }

                    }
                    await _unitOfWork.SaveChangesAsync();
                    scope.Complete();
                    return CreatedAtAction(nameof(GetPromotionProductById), new { id = promotionProduct.Id }, new Response
                    {
                        Data = promotionProduct,
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
        public async Task<IActionResult> UpdatePromotionProduct(int id, UpdatePromotionProductRequest model)
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
                    PromotionProduct findPromotionProduct = await _promotionProductService.GetPromotionProductById(id);
                    if (findPromotionProduct is null)
                    {
                        return BadRequest(new Response
                        {
                            Success = false,
                            Errors = new[] { "Không tìm thấy" }

                        });
                    }
                    TimeSpan gmt7Offset = TimeSpan.FromHours(7);

                    DateTime adjustedStartDate = model.StartDate + gmt7Offset;
                    DateTime adjustedEndDate = model.EndDate + gmt7Offset;
                    findPromotionProduct.Name = model.Name;
                    findPromotionProduct.StartDate = adjustedStartDate;
                    findPromotionProduct.EndDate = adjustedEndDate;

                    await _promotionProductService.UpdatePromotionProduct(id, findPromotionProduct);
                    // Xóa PromotionProductDetails không có trong model.ListPromotionProducts
                    foreach (var promotionProductDetail in findPromotionProduct.PromotionProductDetails.ToList())
                    {
                        if (!model.ListPromotionProducts.Any(p => p.ProductVersionId == promotionProductDetail.ProductVersionId))
                        {
                            _promotionProductDetailService.DeletePromotionProductDetail(promotionProductDetail.Id);
                        }
                    }
                    foreach (var item in model.ListPromotionProducts)
                    {
                        PromotionProductDetail promotionProductDetail = await _promotionProductDetailService.GetPromotionProductDetailByPromotionProductIdAndProductVersionId(findPromotionProduct.Id, item.ProductVersionId);
                        if (promotionProductDetail is null)
                        {
                            PromotionProductDetail createPromotionProductDetail = new PromotionProductDetail
                            {
                                ProductVersionId = item.ProductVersionId,
                                DiscountedPrice = item.DiscountedPrice,
                                PromotionProductId = findPromotionProduct.Id,
                            };
                            await _promotionProductDetailService.CreatePromotionProductDetail(createPromotionProductDetail);
                        }
                        else
                        {
                            promotionProductDetail.DiscountedPrice = item.DiscountedPrice;
                            await _promotionProductDetailService.UpdatePromotionProductDetail(promotionProductDetail.Id, promotionProductDetail);

                        }

                    }
                    await _unitOfWork.SaveChangesAsync();
                    scope.Complete();
                    return CreatedAtAction(nameof(GetPromotionProductById), new { id = findPromotionProduct.Id }, new Response
                    {
                        Data = findPromotionProduct,
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
        public async Task<IActionResult> DeletePromotionProduct(int id)
        {
            try
            {
                PromotionProduct findPromotionProduct = await _promotionProductService.GetPromotionProductById(id);
                if (findPromotionProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                foreach (var item in findPromotionProduct.PromotionProductDetails.ToList())
                {
                    await _promotionProductDetailService.DeletePromotionProductDetail(item.Id);
                }
                await _promotionProductService.DeletePromotionProduct(findPromotionProduct.Id);
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
        [HttpPut("change-status-promotion-product/{id}")]
        public async Task<IActionResult> ChangeStatusPromotionProduct(int id)
        {
            try
            {
                PromotionProduct findPromotionProduct = await _promotionProductService.GetPromotionProductById(id);
                if (findPromotionProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findPromotionProduct.Disabled = !findPromotionProduct.Disabled;
                await _promotionProductService.UpdatePromotionProduct(id, findPromotionProduct);
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
