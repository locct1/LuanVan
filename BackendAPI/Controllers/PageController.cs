using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Interfaces.Client;
using BackendAPI.Models.Brand;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [Route("api/pages")]
    [ApiController]
    public class PageController : ControllerBase
    {
        private readonly IPageService _pageService;
        private readonly IUnitOfWork _unitOfWork;

        public PageController(IPageService pageService, IUnitOfWork unitOfWork)
        {
            _pageService = pageService;
            _unitOfWork = unitOfWork;
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
    }
}
