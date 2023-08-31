using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Interfaces.Client;
using BackendAPI.Models.Brand;
using BackendAPI.Models.ClientAccount;
using BackendAPI.Models.Order;
using BackendAPI.Services.Client;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace BackendAPI.Controllers
{
    [Route("api/pages")]
    [ApiController]
    public class PageController : ControllerBase
    {
        private readonly IPageService _pageService;
        private readonly IPaymentMethodService _paymentMethodService;
        private readonly IRecipientService _recipientService;
        private readonly IOrderDetailService _orderDetailService;
        private readonly IProductPurchaseOrderDetailService _productPurchaseOrderDetailService;
        private readonly IOrderService _orderService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGetValueToken _getValueToken;
        private readonly IProductSampleService _productSampleService;

        public PageController(IPageService pageService, IPaymentMethodService paymentMethodService, IRecipientService recipientService, IOrderDetailService orderDetailService, IProductPurchaseOrderDetailService productPurchaseOrderDetailService, IOrderService orderService, IUnitOfWork unitOfWork, IGetValueToken getValueToken, IProductSampleService productSampleService)
        {
            _pageService = pageService;
            _paymentMethodService = paymentMethodService;
            _recipientService = recipientService;
            _orderDetailService = orderDetailService;
            _productPurchaseOrderDetailService = productPurchaseOrderDetailService;
            _orderService = orderService;
            _unitOfWork = unitOfWork;
            _getValueToken = getValueToken;
            _productSampleService = productSampleService;
        }

        [HttpGet("get-all-brands")]
        public async Task<IActionResult> GetAllBrands()
        {
            try
            {
                var brands = await _pageService.GetAllBrands();
                return Ok(new Response
                {
                    Data = brands,
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
        [HttpGet("get-all-paymentmethods")]
        public async Task<IActionResult> GetAllPaymentMethods()
        {
            try
            {
                var brands = await _pageService.GetAllPaymentMethods();
                return Ok(new Response
                {
                    Data = brands,
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
        [HttpGet("get-all-products")]
        public async Task<IActionResult> GetAllProducts()
        {
            try
            {
                var brands = await _pageService.GetAllProducts();
                return Ok(new Response
                {
                    Data = brands,
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
        [HttpGet("get-all-products-by-brand-id/{id}")]
        public async Task<IActionResult> GetAllProductsByBrandId(int id)
        {
            try
            {
                var products = await _pageService.GetAllProductsByBrandId(id);
                var brand = await _pageService.GetBrandById(id);
                return Ok(new Response
                {
                    Data = new
                    {
                        products = products,
                        brand = brand,
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
            }
        }
        [HttpGet("get-product-by-id/{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                Product findProduct = await _pageService.GetProductById(id);
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

        [HttpPost("create-order-client")]
        [Authorize]
        public async Task<IActionResult> CreateOrderClient(CreateOrderClientRequest model)
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
                    var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                    var recipient = new Recipient
                    {
                        FullName = model.InfoRecipient.FullName,
                        Email = model.InfoRecipient.Email,
                        Address = model.InfoRecipient.Address,
                        PhoneNumber = model.InfoRecipient.PhoneNumber,
                    };
                    await _recipientService.CreateRecipient(recipient);
                    await _unitOfWork.SaveChangesAsync();
                    var order = new Order
                    {
                        Total = model.Order.Total,
                        Note = model.Order.Note,
                        PaymentMethodId = model.PaymentMethodId,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        UserId = Id,
                        RecipientId = recipient.Id,
                        OrderStatusId = 1,
                    };
                    if (order.PaymentMethodId == 2 || order.PaymentMethodId == 3)
                    {
                        order.Onl_Amount = model.Onl_Amount;
                        order.Onl_BankCode = model.Onl_BankCode;
                        order.Onl_OrderInfo = model.Onl_OrderInfo;
                        order.Onl_PayDate = model.Onl_PayDate;
                        order.Onl_TransactionStatus = model.Onl_TransactionStatus;
                        order.Onl_SecureHash = model.Onl_SecureHash;
                        order.Onl_TransactionNo = model.Onl_TransactionNo;
                        order.Onl_OrderId = model.Onl_OrderId;
                    }
                    await _orderService.CreateOrder(order);
                    await _unitOfWork.SaveChangesAsync();
                    foreach (var item in model.Order.ListProducts)
                    {
                        var productSample = await _productSampleService.GetProductSampleById(item.Id);
                        productSample.Quantity = productSample.Quantity - item.QuantityCart;
                        await _productSampleService.UpdateProductSample(productSample.Id, productSample);
                        await _unitOfWork.SaveChangesAsync();
                        for (int i = 0; i < item.QuantityCart; i++)
                        {
                            var productPurchaseDetail = await _productPurchaseOrderDetailService.GetProductPurchaseOrderDetailFirstĐefaultByStatus(item.Id);
                            if (productPurchaseDetail != null)
                            {
                                productPurchaseDetail.StatusId = 1;
                                _productPurchaseOrderDetailService.UpdateProductPurchaseOrderDetail(productPurchaseDetail.Id, productPurchaseDetail);
                                var OrderDetail = new OrderDetail
                                {
                                    Name = item.ProductName + " (" + item.ColorProduct.Name + ")",
                                    FileName = item.FileName,
                                    PriceOut = item.PriceOut,
                                    OrderId = order.Id,
                                    ProductPurchaseOrderDetailId = productPurchaseDetail.Id,
                                };
                                _orderDetailService.CreateOrderDetail(OrderDetail);
                                await _unitOfWork.SaveChangesAsync();
                            }


                        }
                    }
                    scope.Complete();
                    return Ok(new Response
                    {
                        Success = true,
                        Message = "Đặt đơn hàng thành công"
                    });
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Success = false,
                    Errors = new[] { "Đã có lỗi xảy ra, vui lòng thử lại trong giây lát." }

                });
            }

        }
        [HttpGet("get-all-orders-by-client")]
        [Authorize]
        public async Task<IActionResult> GetAllOrdersByClient(int id)
        {
            try
            {
                var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                var orders = await _pageService.GetAllOrdersByClient(Id);

                return Ok(new Response
                {
                    Data = orders
                 ,
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
        [HttpGet("get-order-by-client/{id}")]
        [Authorize]
        public async Task<IActionResult> GetOrderByClient(int id)
        {
            try
            {
                var userId = _getValueToken.GetClaimValue(HttpContext, "Id");
                Order order = await _pageService.GetOrderByIdClient(id, userId);
                var groupedItems = order.OrderDetails
              .GroupBy(detail => detail.ProductPurchaseOrderDetail.ProductSampleId)
              .Select(group => new
              {
                  ProductSampleId = group.Key,
                  Items = group.Select(item => new
                  {
                      item.Name,
                      item.ProductPurchaseOrderDetailId,
                      item.PriceOut,
                      item.FileName
                  }).ToList()
              })
              .ToList();
                if (order is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data =
                   new
                   {
                       order = order,
                       orderDetails = groupedItems
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
    }
}
