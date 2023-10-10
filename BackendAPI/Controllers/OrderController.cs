using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ColorProduct;
using BackendAPI.Models.Order;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IUnitOfWork _unitOfWork;

        public OrderController(IOrderService orderService, IUnitOfWork unitOfWork)
        {
            _orderService = orderService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {

                var orders = await _orderService.GetAll();

                return Ok(new Response
                {
                    Data =
                       orders,
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
        [HttpGet("get-all-order-statuses")]
        public async Task<IActionResult> GetAllOrderStatuses()
        {
            try
            {

                var statuses = await _orderService.GetAllOrderStatuses();
                return Ok(new Response
                {
                    Data =
                       statuses,
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
        [HttpPut("update-order-status/{id}")]
        public async Task<IActionResult> UpdateOrderStatus(int id, UpdateOrderStatusRequest model)
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
                var message = "Cập nhật trạng thái đơn hàng thành công";
                order.OrderStatusId = model.OrderStatusId;
                if (model.OrderStatusId == 2 && model.OrderCode != null)
                {
                    order.OrderCode = model.OrderCode;
                    message = "Tạo mã vân đơn thành công";
                }
                if (model.OrderStatusId == 6 && model.OrderCode != null)
                {
                    message = "Hủy đơn hàng thành công";
                }
                order.UpdatedAt = DateTime.Now;
                await _orderService.UpdateOrder(order.Id, order);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = message

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
        public async Task<IActionResult> GetOrderbyId(int id)
        {
            try
            {
                Order order = await _orderService.Get(id);
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
        [HttpGet("get-info-print-A5/{token}")]
        public async Task<IActionResult> CallAPIPrintA5(string token)
        {
            string apiUrl = $"https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token={token}";

            // Tạo một đối tượng HttpClient
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    // Gọi API và lấy dữ liệu trả về
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    // Kiểm tra xem kết quả có thành công không (status code 200)
                    if (response.IsSuccessStatusCode)
                    {
                        // Đọc dữ liệu trả về dưới dạng chuỗi
                        string content = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Dữ liệu từ API:");
                        Console.WriteLine(content);
                        return Ok(content);
                    }
                    else
                    {
                        Console.WriteLine("Lỗi khi gọi API. Status code: " + response.StatusCode);
                        return BadRequest("Lỗi khi gọi API");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Lỗi: " + ex.Message);
                    return BadRequest("Lỗi khi gọi API: " + ex.Message);
                }
            }
        }
    }
}
