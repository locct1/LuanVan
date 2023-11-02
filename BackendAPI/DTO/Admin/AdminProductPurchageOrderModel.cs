using BackendAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTO.Admin
{
    public class AdminProductPurchageOrderModel
    {
        public int Id { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int? WareHouseId { get; set; }
        public AdminWareHouseModel? WareHouse { get; set; }
        public int? SupplierId { get; set; }
        public AdminSupplierModel? Supplier { get; set; }
        public string? UserId { get; set; }
        public UserModel? User { get; set; }
        public int StatusId { get; set; }
        public double Total { get; set; }
        public List<AdminProductPurchaseOrderDetailModel> ProductPurchaseOrderDetails { get; set; }
    }
    public class AdminWareHouseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
    }
    public class AdminSupplierModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
    public class AdminProductPurchaseOrderDetailModel
    {
        public int Id { get; set; }
        //public ProductSample ProductSample { get; set; }
        public int ProductSampleId { get; set; }
        public string Name { get; set; }
        public int StatusId { get; set; }
        public double PriceIn { get; set; }
        public int ProductPurchaseOrderId { get; set; }
    }
}
