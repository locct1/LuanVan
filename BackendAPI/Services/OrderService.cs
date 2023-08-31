using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class OrderService : IOrderService

    {
        private readonly IUnitOfWork _unitOfWork;
        public OrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Order>> GetAll()
        {
            return await _unitOfWork.GetRepository<Order>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id),
                include: p => p.Include(p => p.OrderDetails).ThenInclude(x => x.ProductPurchaseOrderDetail)
                .Include(x => x.User).Include(x => x.Recipient).Include(x => x.OrderStatus).Include(x => x.PaymentMethod));
        }
        public async Task<IEnumerable<OrderStatus>> GetAllOrderStatuses()
        {
            return await _unitOfWork.GetRepository<OrderStatus>().GetAll();
        }
        public async Task<IEnumerable<Order>> GetPagedList(int page, int limit)
        {
            return await _unitOfWork.GetRepository<Order>().GetPagedList(null, null, null, page, limit);
        }
        public async Task<Order?> GetOrderById(int id)
        {
            return await _unitOfWork.GetRepository<Order>().GetByID(id);
        }
        public async Task<Order?> Get(int id)
        {
            return await _unitOfWork.GetRepository<Order>().Get(filter: x => x.Id == id,include: p => p.Include(p => p.OrderDetails).ThenInclude(x => x.ProductPurchaseOrderDetail)
                .Include(x => x.User).Include(x => x.Recipient).Include(x => x.OrderStatus).Include(x => x.PaymentMethod));

        }
        public async Task CreateOrder(Order newOrder)
        {
            await _unitOfWork.GetRepository<Order>().Insert(newOrder);
        }
        public async Task UpdateOrder(int id, Order updateOrder)
        {
            await _unitOfWork.GetRepository<Order>().Update(updateOrder);
        }
        public async Task DeleteOrder(int id)
        {
            await _unitOfWork.GetRepository<Order>().Delete(id);
        }
    }
}
