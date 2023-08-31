using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IPaymentMethodService
    {
        Task<IEnumerable<PaymentMethod>> GetAll();
        Task<IEnumerable<PaymentMethod>> GetPagedList(int page, int limit);
        Task<PaymentMethod> GetPaymentMethodById(int id);
        Task CreatePaymentMethod(PaymentMethod paymentMethod);
        Task UpdatePaymentMethod(int id, PaymentMethod paymentMethod);
        Task DeletePaymentMethod(int id);
    }
}
