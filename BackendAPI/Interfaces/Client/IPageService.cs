﻿using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Models.ClientAccount;

namespace BackendAPI.Interfaces.Client
{
    public interface IPageService
    {
        Task<IEnumerable<Brand>> GetAllBrands();
        Task<Brand> GetBrandById(int id);
        Task<IEnumerable<Product>> GetAllProducts();
        Task<IEnumerable<PromotionProduct>> GetAllPromotionProducts();
        Task<IEnumerable<ShockDeal>> GelAllShockDeals();
        Task<IEnumerable<Product>> GetAllProductsByBrandId(int id);
        Task<Product> GetProductById(int id);
        Task<IEnumerable<PaymentMethod>> GetAllPaymentMethods();
        Task<IEnumerable<Order>> GetAllOrdersByClient(string userId);
        Task<Order> GetOrderByIdClient(int orderId, string userId);
        Task<IEnumerable<ProductSample>> GetAllProductSamples();
        Task<IEnumerable<Ram>> GetAllRams();
        Task<IEnumerable<OperatingSystemType>> GetAllOperatingSystemTypes();
        Task<IEnumerable<Rom>> GetAllRoms();
        Task<IEnumerable<ProductVersion>> GetAllProductVersions();


    }
}
