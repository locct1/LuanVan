using BackendAPI.Data;

namespace BackendAPI.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAll();
        Task<Order> Get(int id);
        Task<IEnumerable<OrderStatus>> GetAllOrderStatuses();
        Task<IEnumerable<Order>> GetPagedList(int page, int limit);
        Task<Order> GetOrderById(int id);
        Task CreateOrder(Order order);
        Task UpdateOrder(int id, Order order);
        Task DeleteOrder(int id);
    }
}
