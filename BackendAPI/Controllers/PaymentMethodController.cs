using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.PaymentMethod;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/payment-methods")]
    [ApiController]
    public class PaymentMethodController : ControllerBase
    {
        private readonly IPaymentMethodService _paymentMethodService;
        private readonly IUnitOfWork _unitOfWork;

        public PaymentMethodController(IPaymentMethodService paymentMethodService, IUnitOfWork unitOfWork)
        {
            _paymentMethodService = paymentMethodService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllPaymentMethods(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var warehouses = await _paymentMethodService.GetAll();
                    return Ok(new Response
                    {
                        Data = warehouses,
                        Success = true,

                    });
                }
                else
                {
                    var warehouses = await _paymentMethodService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = warehouses,
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
        public async Task<IActionResult> GetPaymentMethodById(int id)
        {
            try
            {
                PaymentMethod findPaymentMethod = await this._paymentMethodService.GetPaymentMethodById(id);
                if (findPaymentMethod is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findPaymentMethod,
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
        public async Task<IActionResult> CreatePaymentMethod(CreatePaymentMethodRequest model)
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
                PaymentMethod warehouse = new PaymentMethod
                {
                    Name = model.Name,

                };
                await _paymentMethodService.CreatePaymentMethod(warehouse);
                await _unitOfWork.SaveChangesAsync();
                return CreatedAtAction(nameof(GetPaymentMethodById), new { id = warehouse.Id }, new Response
                {
                    Data = warehouse,
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
        public async Task<IActionResult> UpdatePaymentMethod(int id, UpdatePaymentMethodRequest model)
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
                PaymentMethod findPaymentMethod = await _paymentMethodService.GetPaymentMethodById(id);
                if (findPaymentMethod is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findPaymentMethod.Name = model.Name;
                await _paymentMethodService.UpdatePaymentMethod(id, findPaymentMethod);
                await _unitOfWork.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPaymentMethodById), new { id = findPaymentMethod.Id }, new Response
                {
                    Data = findPaymentMethod,
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
        public async Task<IActionResult> DeletePaymentMethod(int id)
        {
            try
            {
                PaymentMethod findPaymentMethod = await _paymentMethodService.GetPaymentMethodById(id);
                if (findPaymentMethod is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _paymentMethodService.DeletePaymentMethod(findPaymentMethod.Id);
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
