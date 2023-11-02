using AutoMapper;
using BackendAPI.Data;
using BackendAPI.DTO.Admin;
using BackendAPI.DTO.Client;
using BackendAPI.Helpers;
using BackendAPI.Helpers.Mail;
using BackendAPI.Interfaces;
using BackendAPI.Interfaces.Client;
using BackendAPI.Models.Brand;
using BackendAPI.Models.ClientAccount;
using BackendAPI.Models.ColorProduct;
using BackendAPI.Models.Order;
using BackendAPI.Models.ProductSample;
using BackendAPI.Models.ReviewProduct;
using BackendAPI.Services;
using BackendAPI.Services.Client;
using BackendAPI.UnitOfWorks;
using MailKit.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;
using System.Xml.Linq;

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
        private readonly IReviewProductService _reviewProductService;
        private readonly IReviewProductPhotoService _reviewProductPhotoService;
        private readonly ILikeReviewProductService _likeReviewProductService;
        private readonly IColorProductService _colorProductService;
        private readonly IProductColorProductService _productColorProductService;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;

        public PageController(IPageService pageService, IPaymentMethodService paymentMethodService, IRecipientService recipientService, IOrderDetailService orderDetailService, IProductPurchaseOrderDetailService productPurchaseOrderDetailService, IOrderService orderService, IUnitOfWork unitOfWork, IGetValueToken getValueToken, IProductSampleService productSampleService, IReviewProductService reviewProductService, IReviewProductPhotoService reviewProductPhotoService, ILikeReviewProductService likeReviewProductService, IColorProductService colorProductService, IProductColorProductService productColorProductService, IEmailSender emailSender, IMapper mapper)
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
            _reviewProductService = reviewProductService;
            _reviewProductPhotoService = reviewProductPhotoService;
            _likeReviewProductService = likeReviewProductService;
            _colorProductService = colorProductService;
            _productColorProductService = productColorProductService;
            _emailSender = emailSender;
            _mapper = mapper;
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
        [HttpGet("get-all-rams")]
        public async Task<IActionResult> GetAllRams()
        {
            try
            {
                var rams = await _pageService.GetAllRams();
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
                var rams = await _pageService.GetAllRoms();
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
        [HttpGet("get-all-product-versions")]
        public async Task<IActionResult> GetAllProductVersions()
        {
            try
            {
                var productVersions = await _pageService.GetAllProductVersions();
                return Ok(new Response
                {
                    Data = productVersions,
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
        [HttpGet("get-all-operating-system-types")]
        public async Task<IActionResult> GetAllOperatingSystemTypes()
        {
            try
            {
                var rams = await _pageService.GetAllOperatingSystemTypes();
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
                var products = await _pageService.GetAllProducts();
                var data = _mapper.Map<List<ClientProductViewModel>>(products);

                return Ok(new Response
                {
                    Data = data,
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
        [HttpGet("get-all-promotion-products")]
        public async Task<IActionResult> GetAllPromotionProducts()
        {
            try
            {
                var promotionProducts = await _pageService.GetAllPromotionProducts();
                var currentDate = DateTime.Now;

                // Lọc danh sách sản phẩm dựa trên ngày hiện tại
                var filteredProducts = promotionProducts
                    .Where(product => currentDate >= product.StartDate && currentDate <= product.EndDate)
                    .ToList();
                return Ok(new Response
                {
                    Data = filteredProducts,
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
        [HttpGet("get-all-shock-deals")]
        public async Task<IActionResult> GellAllShockDeals()
        {
            try
            {
                var promotionProducts = await _pageService.GelAllShockDeals();
                var currentDate = DateTime.Now;

                // Lọc danh sách sản phẩm dựa trên ngày hiện tại
                var filteredProducts = promotionProducts
                    .Where(product => currentDate >= product.StartDate && currentDate <= product.EndDate)
                    .ToList();
                return Ok(new Response
                {
                    Data = filteredProducts,
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
        [HttpGet("get-all-productsamples")]
        public async Task<IActionResult> GetAllProductSamples()
        {
            try
            {
                var productSamples = await _pageService.GetAllProductSamples();
                var data = _mapper.Map<List<ProductSampleModel>>(productSamples);
                return Ok(new Response
                {
                    Data = data,
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
                var data = _mapper.Map<ClientProductViewModel>(findProduct);
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
                    Data = data,
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
                        PaymentMethodId = model.PaymentMethodId,
                        CreatedAt = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                        UserId = Id,
                        Note = model.Note,
                        RecipientId = recipient.Id,
                        OrderStatusId = 1,
                        WardCode = model.InfoRecipient.WardCode,
                        DistrictID = model.InfoRecipient.DistrictID,
                        ProvinceID = model.InfoRecipient.ProvinceID,
                        HouseNumberAndStreet = model.InfoRecipient.HouseNumberAndStreet,
                        Height = model.Height,
                        Weight = model.Weight,
                        Length = model.Length,
                        Width = model.Width
                    };
                    //if (order.PaymentMethodId == 2 || order.PaymentMethodId == 3)
                    //{
                    //    order.Onl_Amount = model.Onl_Amount;
                    //    order.Onl_BankCode = model.Onl_BankCode;
                    //    order.Onl_OrderInfo = model.Onl_OrderInfo;
                    //    order.Onl_PayDate = model.Onl_PayDate;
                    //    order.Onl_TransactionStatus = model.Onl_TransactionStatus;
                    //    order.Onl_SecureHash = model.Onl_SecureHash;
                    //    order.Onl_TransactionNo = model.Onl_TransactionNo;
                    //    order.Onl_OrderId = model.Onl_OrderId;
                    //}
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
                                string productName = "";
                                if (item.ProductVersion.Ram != null && item.ProductVersion.Ram != null)
                                {
                                    productName = item.ProductVersion.Ram.Name + "GB" + "-" + item.ProductVersion.Rom.Name + "GB";
                                }
                                var OrderDetail = new OrderDetail
                                {
                                    Name = item.ProductName + " " + productName + " (" + item.ColorProduct.Name + ")",
                                    FileName = item.FileName,
                                    PriceOut = item.DiscountedPrice ?? item.PriceOut,
                                    OrderId = order.Id,
                                    ProductPurchaseOrderDetailId = productPurchaseDetail.Id,
                                    IsShockDeal = false,
                                };
                                _orderDetailService.CreateOrderDetail(OrderDetail);
                                await _unitOfWork.SaveChangesAsync();
                            }


                        }
                    }
                    foreach (var item in model.Order.ListShockDeals)
                    {
                        var productSamples = await _productSampleService.GetAllProductSamplesByProductVersion(item.ProductVersionId);
                        var firstProductSampleWithPositiveQuantity = productSamples.FirstOrDefault(ps => ps.Quantity > 0);
                        firstProductSampleWithPositiveQuantity.Quantity = firstProductSampleWithPositiveQuantity.Quantity - item.QuantityCart;
                        int colorProductId = firstProductSampleWithPositiveQuantity.ColorProductId.Value;
                        ColorProduct colorProduct = await _colorProductService.GetColorProductById(colorProductId);
                        ProductColorProduct productColorProduct = await _productColorProductService.GetProductColorProductByProductIdAndColorProductId(item.ProductId, colorProductId);
                        await _productSampleService.UpdateProductSample(firstProductSampleWithPositiveQuantity.Id, firstProductSampleWithPositiveQuantity);
                        await _unitOfWork.SaveChangesAsync();
                        for (int i = 0; i < item.QuantityCart; i++)
                        {
                            var productPurchaseDetail = await _productPurchaseOrderDetailService.GetProductPurchaseOrderDetailFirstĐefaultByStatus(firstProductSampleWithPositiveQuantity.Id);
                            if (productPurchaseDetail != null)
                            {
                                productPurchaseDetail.StatusId = 1;
                                _productPurchaseOrderDetailService.UpdateProductPurchaseOrderDetail(productPurchaseDetail.Id, productPurchaseDetail);
                                string productName = "";

                                var OrderDetail = new OrderDetail
                                {
                                    Name = item.ProductName + " (" + colorProduct.Name + ")",
                                    FileName = productColorProduct.FileName,
                                    PriceOut = item.ShockDealPrice,
                                    OrderId = order.Id,
                                    IsShockDeal = true,
                                    ProductPurchaseOrderDetailId = productPurchaseDetail.Id,
                                };
                                _orderDetailService.CreateOrderDetail(OrderDetail);
                                await _unitOfWork.SaveChangesAsync();
                            }


                        }
                    }
                    string emailBody = $@"<h3  style='color: #000000;' >Xin chào {model.InfoRecipient.FullName},</h3>
                                <p  style='color: #000000;'>Bạn nhận được email này vì đã đặt hàng trên Web LKShop</p>
                                <h3  style='color: #000000;'>Thông tin đặt hàng của bạn:</h3>
                                <div  style='color: #000000;'><b>Thông tin người nhận hàng:</b></div>
                                <div  style='color: #000000;'><b>Người nhận hàng:</b> {model.InfoRecipient.FullName}</div>
                                <div  style='color: #000000;'><b>Email: </b>{model.InfoRecipient.Email}</div>
                                <div  style='color: #000000;'><b>Số điện thoại: </b>{model.InfoRecipient.PhoneNumber}</div>
                                <div  style='color: #000000;'><b>Địa chỉ:</b> {model.InfoRecipient.Address}</div>
                                <div  style='color: #000000;'><b>Tổng tiền:</b> {model.Order.Total.ToString("N0")}đ</div>
                                ";

                    // Thêm bảng sản phẩm
                    emailBody += "<h3>Sản phẩm trong đơn hàng:</h3>";
                    emailBody += "<table style='font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%;'>";
                    emailBody += "<tr><th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #000000; color: white;'>Tên sản phẩm</th>";
                    emailBody += "<th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #000000; color: white;'>Giá</th>";
                    emailBody += "<th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #000000; color: white;'>Số lượng</th></tr>";

                    foreach (var product in model.Order.ListProducts)
                    {
                        string productName = "";
                        if (product.ProductVersion.Ram != null && product.ProductVersion.Ram != null)
                        {
                            productName = product.ProductVersion.Ram.Name + "GB" + "-" + product.ProductVersion.Rom.Name + "GB";
                        }

                        string formattedPrice = product.DiscountedPrice.HasValue
                            ? product.DiscountedPrice.Value.ToString("N0")
                            : product.PriceOut.ToString("N0");

                        emailBody += $"<tr><td style='border: 1px solid #ddd; padding: 8px; text-align: left; color: #000000;'>{product.ProductName + " " + productName + " (" + product.ColorProduct.Name + ")"}</td>";
                        emailBody += $"<td style='border: 1px solid #ddd; padding: 8px; text-align: left; color: #000000;'>{formattedPrice}đ</td>";
                        emailBody += $"<td style='border: 1px solid #ddd; padding: 8px; text-align: left; color: #000000;'>{product.QuantityCart}</td></tr>";
                    }

                    emailBody += "</table>";

                    // Thêm thông tin sản phẩm từ listShockDeals vào một bảng riêng
                    emailBody += "<h3>Sản phẩm Shock Deal trong đơn hàng:</h3>";
                    emailBody += "<table style='font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%;'>";
                    emailBody += "<tr><th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #000000; color: white;'>Tên sản phẩm Shock Deal</th>";
                    emailBody += "<th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #000000; color: white;'>Giá</th>";
                    emailBody += "<th style='border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #000000; color: white;'>Số lượng</th></tr>";

                    foreach (var shockDeal in model.Order.ListShockDeals)
                    {
                        var productSamples = await _productSampleService.GetAllProductSamplesByProductVersion(shockDeal.ProductVersionId);
                        var firstProductSampleWithPositiveQuantity = productSamples.FirstOrDefault(ps => ps.Quantity > 0);
                        firstProductSampleWithPositiveQuantity.Quantity = firstProductSampleWithPositiveQuantity.Quantity - shockDeal.QuantityCart;
                        int colorProductId = firstProductSampleWithPositiveQuantity.ColorProductId.Value;
                        ColorProduct colorProduct = await _colorProductService.GetColorProductById(colorProductId);
                        string formattedShockDealPrice = shockDeal.ShockDealPrice.ToString("N0");
                        string productName = $"<span style='color: red;'>[Deal sốc]</span> {shockDeal.ProductName} ({colorProduct.Name})";
                        emailBody += $"<tr><td style='border: 1px solid #ddd; padding: 8px; text-align: left; color: #000000;'>{productName}</td>";
                        emailBody += $"<td style='border: 1px solid #ddd; padding: 8px; text-align: left; color: #000000;'>{formattedShockDealPrice}đ</td>";
                        emailBody += $"<td style='border: 1px solid #ddd; padding: 8px; text-align: left; color: #000000;'>{shockDeal.QuantityCart}</td></tr>";
                    }

                    emailBody += "</table>";

                    emailBody += "<div style='color: #000000;'>Xin chân thành cảm ơn!</div>";

                    await _emailSender.SendEmailAsync("kingkongct2001@gmail.com",
                        "Xác nhận đơn đặt hàng trên LKShop",
                        emailBody);

                    scope.Complete();
                    return Ok(new Response
                    {
                        Data = order,
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
        [HttpPut("update-order-client/{id}")]
        public async Task<IActionResult> UpdateOrderClient(int id, UpdateOrderRequest model)
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
                if (id != model.OrderId)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });

                }
                Order findOrder = await _orderService.GetOrderById(id);
                if (findOrder is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findOrder.Onl_Amount = model.Onl_Amount;
                findOrder.Onl_BankCode = model.Onl_BankCode;
                findOrder.Onl_OrderInfo = model.Onl_OrderInfo;
                findOrder.Onl_PayDate = model.Onl_PayDate;
                findOrder.Onl_TransactionStatus = model.Onl_TransactionStatus;
                findOrder.Onl_SecureHash = model.Onl_SecureHash;
                findOrder.Onl_TransactionNo = model.Onl_TransactionNo;
                findOrder.Onl_OrderId = model.Onl_OrderId;

                await _orderService.UpdateOrder(id, findOrder);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new Response
                {
                    Data = findOrder,
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
        [HttpGet("get-all-orders-by-client")]
        [Authorize]
        public async Task<IActionResult> GetAllOrdersByClient(int id)
        {
            try
            {
                var Id = _getValueToken.GetClaimValue(HttpContext, "Id");
                var orders = await _pageService.GetAllOrdersByClient(Id);
                var data = _mapper.Map<List<AdminOrderModel>>(orders);

                return Ok(new Response
                {
                    Data = data
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
                var data = _mapper.Map<AdminOrderModel>(order);
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
                      item.IsShockDeal,
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
                       order = data,
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
        [HttpPost("create-review-product")]
        [Authorize]
        public async Task<IActionResult> CreateReviewProduct([FromForm] CreateReviewProductRequest model)
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
                    var reviewProduct = new ReviewProduct
                    {
                        ProductId = model.ProductId,
                        UserId = model.UserId,
                        Rating = model.Rating,
                        CommentContent = model.CommentContent,
                        CreatedAt = DateTime.Now,

                    };
                    await _reviewProductService.CreateReviewProduct(reviewProduct);
                    await _unitOfWork.SaveChangesAsync();
                    if (model.Images != null)
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

                            var file = Path.Combine("Uploads", "ReviewProduct", file1);

                            using (var filestream = new FileStream(file, FileMode.Create))
                            {
                                await f.CopyToAsync(filestream);
                            }
                            var photo = new ReviewProductPhoto
                            {
                                FileName = file1,
                                ReviewProductId = reviewProduct.Id
                            };
                            await _reviewProductPhotoService.CreateReviewProductPhoto(photo);
                            await _unitOfWork.SaveChangesAsync();
                        }
                    }

                    scope.Complete();

                    return Ok(new Response
                    {
                        Success = true,
                        Message = "Upload thành công"
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
        [HttpGet("get-all-review-products-by-product-id/{id}")]
        public async Task<IActionResult> GetAllReviewProductsByProductId(int id)
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
                var reviewProducts = await _reviewProductService.GetAllReviewProductsByProductId(id);
                var data = _mapper.Map<List<AdminReviewProductModel>>(reviewProducts);
                return Ok(new Response
                {
                    Data = data,
                    Success = true,
                    Message = "Thành công"
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
        [HttpPost("like-review-product/{id}")]
        [Authorize]
        public async Task<IActionResult> LikeReviewProduct(int id)
        {
            try
            {
                var userId = _getValueToken.GetClaimValue(HttpContext, "Id");
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors)
                                                  .Select(e => e.ErrorMessage)
                                                  .ToArray();
                    return BadRequest(new Response { Success = false, Errors = errors });
                }
                LikeReviewProduct likeReviewProduct = new LikeReviewProduct
                {
                    ReviewProductId = id,
                    UserId = userId,


                };
                await _likeReviewProductService.CreateLikeReviewProduct(likeReviewProduct);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Data = likeReviewProduct,
                    Success = true,
                    Message = "Thích thành công"

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
        [HttpDelete("unlike-review-product/{id}")]
        [Authorize]
        public async Task<IActionResult> UnLikeReviewProduct(int id)
        {
            try
            {
                LikeReviewProduct likeReviewProduct = await _likeReviewProductService.GetLikeReviewProductById(id);
                if (likeReviewProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _likeReviewProductService.DeleteLikeReviewProduct(likeReviewProduct.Id);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Bỏ thích thành công"
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
        [HttpPut("request-cancel-order-client/{id}")]
        [Authorize]
        public async Task<IActionResult> RequestCancelOrderClient(int id, UpdateOrderStatusRequest model)
        {
            try
            {
                Order order = await this._orderService.GetOrderById(id);
                if (order is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                order.OrderStatusId = 5;
                order.UpdatedAt = DateTime.Now;
                await _orderService.UpdateOrder(order.Id, order);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Yêu cầu hủy đơn hàng thành công"

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
        [HttpDelete("delete-review-product/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReviewProduct(int id)
        {
            try
            {
                ReviewProduct reviewProduct = await _reviewProductService.Get(id);
                if (reviewProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                foreach (var item in reviewProduct.LikeReviewProducts)
                {
                    await _likeReviewProductService.DeleteLikeReviewProduct(item.Id);
                }
                foreach (var item in reviewProduct.ReviewProductPhotos)
                {
                    var filename = "Uploads/ReviewProduct/" + item.FileName;
                    System.IO.File.Delete(filename);
                    await _reviewProductPhotoService.DeleteReviewProductPhoto(item.Id);
                }
                await _reviewProductService.DeleteReviewProduct(reviewProduct.Id);
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
