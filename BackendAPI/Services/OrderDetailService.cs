using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class OrderDetailService : IOrderDetailService

    {
        private readonly IUnitOfWork _unitOfWork;
        public OrderDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<OrderDetail>> GetAll()
        {
            return await _unitOfWork.GetRepository<OrderDetail>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<OrderDetail>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<OrderDetail>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<OrderDetail?> GetOrderDetailById(int id)
        {
            return await _unitOfWork.GetRepository<OrderDetail>().GetByID(id);
        }

        public async Task CreateOrderDetail(OrderDetail newOrderDetail)
        {
            await _unitOfWork.GetRepository<OrderDetail>().Insert(newOrderDetail);
        }
        public async Task UpdateOrderDetail(int id, OrderDetail updateOrderDetail)
        {
            await _unitOfWork.GetRepository<OrderDetail>().Update(updateOrderDetail);
        }
        public async Task DeleteOrderDetail(int id)
        {
            await _unitOfWork.GetRepository<OrderDetail>().Delete(id);
        }
    }
}
