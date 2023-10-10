namespace BackendAPI.Models.Order
{
    public class UpdateOrderStatusRequest
    {
        public int OrderStatusId { get; set; }
        public string? OrderCode { get; set; }

    }
}
