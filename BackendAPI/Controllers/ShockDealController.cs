using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ShockDeal;
using BackendAPI.Services;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace BackendAPI.Controllers
{
    [Route("api/shock-deals")]
    [ApiController]
    public class ShockDealController : ControllerBase
    {
        private readonly IShockDealService _shockDealService;
        private readonly IShockDealDetailService _shockDealDetailService;
        private readonly IUnitOfWork _unitOfWork;

        public ShockDealController(IShockDealService shockDealService, IShockDealDetailService shockDealDetailService, IUnitOfWork unitOfWork)
        {
            _shockDealService = shockDealService;
            _shockDealDetailService = shockDealDetailService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]

        public async Task<IActionResult> GetAllShockDeals(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var shockDeals = await _shockDealService.GetAll();
                    return Ok(new Response
                    {
                        Data = shockDeals,
                        Success = true,

                    });
                }
                else
                {
                    var shockDeals = await _shockDealService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = shockDeals,
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
        public async Task<IActionResult> GetShockDealById(int id)
        {
            try
            {
                ShockDeal findShockDeal = await this._shockDealService.Get(id);
                if (findShockDeal is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findShockDeal,
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
        public async Task<IActionResult> CreateShockDeal(CreateShockDealRequest model)
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
                    ShockDeal shockDeal = new ShockDeal
                    {
                        Name = model.Name,
                        StartDate = adjustedStartDate,
                        EndDate = adjustedEndDate,
                        Disabled = true,
                    };
                    await _shockDealService.CreateShockDeal(shockDeal);
                    await _unitOfWork.SaveChangesAsync();
                    foreach (var item in model.ListMainProducts)
                    {
                        foreach (var item1 in model.ListShockDealProducts)
                        {
                            ShockDealDetail shockDealDetal = new ShockDealDetail
                            {
                                MainProductId = item.Id,
                                ShockDealProductId = item1.Id,
                                ShockDealPrice = item1.ShockDealPrice,
                                ShockDealId = shockDeal.Id
                            };
                            await _shockDealDetailService.CreateShockDealDetail(shockDealDetal);

                        }
                    }
                    await _unitOfWork.SaveChangesAsync();
                    scope.Complete();
                    return CreatedAtAction(nameof(GetShockDealById), new { id = shockDeal.Id }, new Response
                    {
                        Data = shockDeal,
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
        public async Task<IActionResult> UpdateShockDeal(int id, UpdateShockDealRequest model)
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
                    ShockDeal findShockDeal = await _shockDealService.Get(id);
                    if (findShockDeal is null)
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
                    findShockDeal.Name = model.Name;
                    findShockDeal.StartDate = adjustedStartDate;
                    findShockDeal.EndDate = adjustedEndDate;

                    await _shockDealService.UpdateShockDeal(id, findShockDeal);

                    foreach (var shockDealDetail in findShockDeal.ShockDealDetails.ToList())
                    {
                        if (!model.ListMainProducts.Any(p => p.Id == shockDealDetail.MainProductId))
                        {
                            _shockDealDetailService.DeleteShockDealDetail(shockDealDetail.Id);
                        }
                        if (!model.ListShockDealProducts.Any(p => p.Id == shockDealDetail.MainProductId))
                        {
                            _shockDealDetailService.DeleteShockDealDetail(shockDealDetail.Id);
                        }
                    }
                    foreach (var item in model.ListMainProducts)
                    {
                        foreach (var item1 in model.ListShockDealProducts)
                        {
                            ShockDealDetail shockDealDetail = await _shockDealDetailService.GetShockDealDetailByMainProductIdAndShockDealProductId(item.Id, item1.Id, findShockDeal.Id);
                            if (shockDealDetail is null)
                            {
                                ShockDealDetail shockDealDetal = new ShockDealDetail
                                {
                                    MainProductId = item.Id,
                                    ShockDealProductId = item1.Id,
                                    ShockDealPrice = item1.ShockDealPrice,
                                    ShockDealId = findShockDeal.Id
                                };
                                await _shockDealDetailService.CreateShockDealDetail(shockDealDetal);
                            }
                            else
                            {
                                shockDealDetail.ShockDealPrice = item1.ShockDealPrice;
                                await _shockDealDetailService.UpdateShockDealDetail(shockDealDetail.Id, shockDealDetail);

                            }
                        }

                    }
                    await _unitOfWork.SaveChangesAsync();
                    scope.Complete();
                    return CreatedAtAction(nameof(GetShockDealById), new { id = findShockDeal.Id }, new Response
                    {
                        Data = findShockDeal,
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
        public async Task<IActionResult> DeleteShockDeal(int id)
        {
            try
            {
                ShockDeal findShockDeal = await _shockDealService.Get(id);
                if (findShockDeal is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                foreach (var item in findShockDeal.ShockDealDetails.ToList())
                {
                    await _shockDealDetailService.DeleteShockDealDetail(item.Id);
                }
                await _shockDealService.DeleteShockDeal(findShockDeal.Id);
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
        [HttpPut("change-status-shock-deal/{id}")]
        public async Task<IActionResult> ChangeStatusShockDeal(int id)
        {
            try
            {
                ShockDeal findShockDeal = await _shockDealService.GetShockDealById(id);
                if (findShockDeal is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                findShockDeal.Disabled = !findShockDeal.Disabled;
                await _shockDealService.UpdateShockDeal(id, findShockDeal);
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
