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
                order.OrderStatusId = model.OrderStatusId;
                order.UpdatedAt = DateTime.Now;
                await _orderService.UpdateOrder(order.Id, order);
                await _unitOfWork.SaveChangesAsync();
                return Ok(new Response
                {
                    Success = true,
                    Message = "Cập nhật trạng thái thành công"

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
                   new {
                        order=order,
                        orderDetails= groupedItems
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
