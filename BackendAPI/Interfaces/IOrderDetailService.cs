using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IOrderDetailService
    {
        Task<IEnumerable<OrderDetail>> GetAll();
        Task<IEnumerable<OrderDetail>> GetPagedList(int page, int limit);
        Task<OrderDetail> GetOrderDetailById(int id);
        Task CreateOrderDetail(OrderDetail orderDetail);
        Task UpdateOrderDetail(int id, OrderDetail orderDetail);
        Task DeleteOrderDetail(int id);
    }
}
