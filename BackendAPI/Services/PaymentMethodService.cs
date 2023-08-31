using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class PaymentMethodService : IPaymentMethodService

    {
        private readonly IUnitOfWork _unitOfWork;
        public PaymentMethodService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<PaymentMethod>> GetAll()
        {
            return await _unitOfWork.GetRepository<PaymentMethod>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<PaymentMethod>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<PaymentMethod>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<PaymentMethod?> GetPaymentMethodById(int id)
        {
            return await _unitOfWork.GetRepository<PaymentMethod>().GetByID(id);
        }

        public async Task CreatePaymentMethod(PaymentMethod newPaymentMethod)
        {
            await _unitOfWork.GetRepository<PaymentMethod>().Insert(newPaymentMethod);
        }
        public async Task UpdatePaymentMethod(int id, PaymentMethod updatePaymentMethod)
        {
            await _unitOfWork.GetRepository<PaymentMethod>().Update(updatePaymentMethod);
        }
        public async Task DeletePaymentMethod(int id)
        {
            await _unitOfWork.GetRepository<PaymentMethod>().Delete(id);
        }
    }
}
