using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ProductPurchaseOrder;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace BackendAPI.Controllers
{
    [Route("api/product-purchase-orders")]
    [ApiController]
    public class ProductPurchaseOrderController : ControllerBase
    {
        private readonly IProductPurchaseOrderService _productPurchaseOrderService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGetValueToken _getValueToken;
        private readonly IProductSampleService _productSampleService;
        private readonly IColorProductService _colorProductService;
        private readonly IProductService _productService;
        private readonly IProductPurchaseOrderDetailService _productPurchaseOrderDetailService;

        public ProductPurchaseOrderController(IProductPurchaseOrderService productPurchaseOrderService, IUnitOfWork unitOfWork, IGetValueToken getValueToken, IProductSampleService productSampleService, IColorProductService colorProductService, IProductService productService, IProductPurchaseOrderDetailService productPurchaseOrderDetailService)
        {
            _productPurchaseOrderService = productPurchaseOrderService;
            _unitOfWork = unitOfWork;
            _getValueToken = getValueToken;
            _productSampleService = productSampleService;
            _colorProductService = colorProductService;
            _productService = productService;
            _productPurchaseOrderDetailService = productPurchaseOrderDetailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var products = await _productPurchaseOrderService.GetAll();

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
        public async Task<IActionResult> GetSupplierById(int id)
        {
            try
            {
                ProductPurchaseOrder findProductPurchaseOrder = await this._productPurchaseOrderService.GetProductPurchaseOrderById(id);
                if (findProductPurchaseOrder is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }
                    });
                }
                var groupedDetails = findProductPurchaseOrder.ProductPurchaseOrderDetails
                    .GroupBy(detail => detail.ProductSampleId)
                    .Select(group => new
                    {
                        ProductSampleId = group.Key,
                        Quantity = group.Count(),
                        Name = group.FirstOrDefault()?.Name, // Lấy tên mẫu sản phẩm
                        PriceIn = group.FirstOrDefault()?.PriceIn // Lấy tên mẫu sản phẩm
                    })
                    .ToList();
                return Ok(new Response
                {
                    Data = new
                    {
                        ProductPurchaseOrder = findProductPurchaseOrder,
                        ProductPurchaseOrderDetails = groupedDetails
                    },
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

        [HttpGet("get-all-products-by-warehouse/{id}")]
        public async Task<IActionResult> GetAllProductByWareHouse(int id, int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var products = await _productPurchaseOrderService.GetAllProductByWareHouseId(id);
                    return Ok(new Response
                    {
                        Data = products,
                        Success = true,
                    });
                }
                else
                {
                    var products = await _productPurchaseOrderService.GetAllProductByWareHouseId(id);

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

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProductPurchaseOrder(CreateProductPurchaseOrderRequest model)
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
                var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                ProductPurchaseOrder productPurchaseOrder = new ProductPurchaseOrder
                {
                    WareHouseId = model.WarehouseId,
                    SupplierId = model.SupplierId,
                    StatusId = 0,
                    Total = model.Total,
                    UserId = Id,
                    PurchaseDate = DateTime.UtcNow
                };
                await _productPurchaseOrderService.CreateProductPurchaseOrder(productPurchaseOrder);
                await _unitOfWork.SaveChangesAsync();
                foreach (var item in model.ListProductPurchaseOrders)
                {
                    ProductSample productSample = await _productSampleService.Get(item.ProductSampleId);
                    if (productSample != null)
                    {
                        productSample.Quantity = item.Quantity + productSample.Quantity;
                    }
                    await _productSampleService.UpdateProductSample(productSample.Id, productSample);
                    await _unitOfWork.SaveChangesAsync();
                    for (int i = 0; i < item.Quantity; i++)
                    {
                        Random random = new Random();
                        int minValue = 10000000;
                        int maxValue = 99999999;
                        int randomNumber;
                        bool check = false;
                        do
                        {
                            randomNumber = random.Next(minValue, maxValue + 1);
                            ProductPurchaseOrderDetail findProductPurchaseOrderDetail = await _productPurchaseOrderDetailService
                                                       .GetProductPurchaseOrderDetailById(randomNumber);
                            if (findProductPurchaseOrderDetail == null)
                                check = true;
                        }
                        while (!check);

                        ProductPurchaseOrderDetail productPurchaseOrderDetail = new ProductPurchaseOrderDetail
                        {
                            ProductSampleId = item.ProductSampleId,
                            ProductPurchaseOrderId = productPurchaseOrder.Id,
                            PriceIn = item.PriceIn,
                            Name = productSample.Product.Name + " (" + productSample.ColorProduct.Name + ")",
                        };
                        await _productPurchaseOrderDetailService.CreateProductPurchaseOrderDetail(productPurchaseOrderDetail);
                        await _unitOfWork.SaveChangesAsync();
                    }
                }
                return Ok(new Response
                {
                    // Data = supplier,
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
    }
}