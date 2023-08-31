using BackendAPI.Interfaces.Client;
using BackendAPI.Models.Order;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

namespace BackendAPI.Controllers
{
    [Route("api/vnpay-client")]
    [ApiController]
    public class VnPayController : ControllerBase
    {
        private readonly IVnPayClientService _vnPayClientService;

        public VnPayController(IVnPayClientService vnPayClientService)
        {
            _vnPayClientService = vnPayClientService;
        }


        [HttpPost("create-order")]
        public IActionResult CreatePaymentUrl(CreatePaymenInformationRequest model)
        {
            var url = _vnPayClientService.CreatePaymentUrl(model, HttpContext);

            return Ok(url);
        }
        [HttpGet("payment-callback")]

        public IActionResult PaymentCallback()
        {
            var response = _vnPayClientService.PaymentExecute(Request.Query);

            return Ok(response);
        }
    }
}
