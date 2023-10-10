using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.ColorProduct;
using BackendAPI.Models.ReviewProduct;
using BackendAPI.Services;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/review-products")]
    [ApiController]
    public class ReviewProductController : ControllerBase
    {
        private readonly IReviewProductService _reviewProductService;
        private readonly IFeedbackReviewProductService _feedbackReviewProductService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGetValueToken _getValueToken;

        public ReviewProductController(IReviewProductService reviewProductService, IFeedbackReviewProductService feedbackReviewProductService, IUnitOfWork unitOfWork, IGetValueToken getValueToken)
        {
            _reviewProductService = reviewProductService;
            _feedbackReviewProductService = feedbackReviewProductService;
            _unitOfWork = unitOfWork;
            _getValueToken = getValueToken;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReviewProducts(int page, int limit)
        {
            try
            {
                if (page == 0 || page == null || limit == 0 || limit == null)
                {
                    var reviewProducts = await _reviewProductService.GetAll();
                    return Ok(new Response
                    {
                        Data = reviewProducts,
                        Success = true,

                    });
                }
                else
                {
                    var reviewProducts = await _reviewProductService.GetPagedList(page, limit);
                    return Ok(new Response
                    {
                        Data = reviewProducts,
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
        [HttpPost("create-feed-back-review-product")]
        [Authorize]
        public async Task<IActionResult> CreateFeedBackReviewProduct(CreateFeedBackReviewProductRequest model)
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

                FeedbackReviewProduct feedbackReviewProduct = new FeedbackReviewProduct
                {
                    ReviewProductId = model.ReviewProductId,
                    UserId = Id,
                    CreatedAt = DateTime.Now,
                    FeedBackContent = model.FeedBackContent
                };
                await _feedbackReviewProductService.CreateFeedbackReviewProduct(feedbackReviewProduct);
                await _unitOfWork.SaveChangesAsync();
                return CreatedAtAction(nameof(GetReviewProductById), new { id = feedbackReviewProduct.ReviewProductId }, new Response
                {
                    Data = feedbackReviewProduct,
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewProductById(int id)
        {
            try
            {
                ReviewProduct findReviewProduct = await this._reviewProductService.GetReviewProductById(id);
                if (findReviewProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                return Ok(new Response
                {
                    Data = findReviewProduct,
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReviewProduct(int id)
        {
            try
            {
                ReviewProduct findReviewProduct = await _reviewProductService.GetReviewProductById(id);
                if (findReviewProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _reviewProductService.DeleteReviewProduct(findReviewProduct.Id);
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
        [HttpDelete("delete-feed-back-review-product/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteFeedBackReviewProduct(int id)
        {
            try
            {
                FeedbackReviewProduct feedbackReviewProduct = await _feedbackReviewProductService.GetFeedbackReviewProductById(id);
                if (feedbackReviewProduct is null)
                {
                    return BadRequest(new Response
                    {
                        Success = false,
                        Errors = new[] { "Không tìm thấy" }

                    });
                }
                await _feedbackReviewProductService.DeleteFeedbackReviewProduct(feedbackReviewProduct.Id);
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
