using BackendAPI.Models.Order;

namespace BackendAPI.Interfaces.Client
{
    public interface IVnPayClientService
    {
        string CreatePaymentUrl(CreatePaymenInformationRequest model, HttpContext context);
        PaymentInformationResponse PaymentExecute(IQueryCollection collections);
    }
}
