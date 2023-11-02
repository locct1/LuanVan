using BackendAPI.Data;
using BackendAPI.Interfaces.Client;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services.Client
{
    public class PageService : IPageService
    {
        private readonly IUnitOfWork _unitOfWork;
        public PageService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Brand>> GetAllBrands()
        {
            return await _unitOfWork.GetRepository<Brand>().GetAll(orderBy: x => x.OrderByDescending(x => x.Id));
        }
        public async Task<IEnumerable<Product>> GetAllProducts()
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.JackPlug).Include(p => p.ChargerPort).Include(p => p.OperatingSystemProduct).ThenInclude(x => x.OperatingSystemType).Include(p => p.ProductColorProducts).Include(p => p.ProductVersions).ThenInclude(x => x.Ram).Include(p => p.ProductVersions).ThenInclude(x => x.Rom), orderBy: x => x.OrderByDescending(x => x.Id));
        }

        public async Task<IEnumerable<Product>> GetAllProductsByBrandId(int id)
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.Chip).Include(p => p.ScreenTechnology).Include(p => p.WareHouse).Include(p => p.ProductColorProducts).Include(p => p.ProductVersions).ThenInclude(x => x.Ram).Include(p => p.ProductVersions).ThenInclude(x => x.Rom), orderBy: x => x.OrderByDescending(x => x.Id), filter: x => x.BrandId == id);

        }
        public async Task<Brand?> GetBrandById(int id)
        {
            return await _unitOfWork.GetRepository<Brand>().GetByID(id);
        }
        public async Task<IEnumerable<PaymentMethod>> GetAllPaymentMethods()
        {
            return await _unitOfWork.GetRepository<PaymentMethod>().GetAll();
        }
        public async Task<Product?> GetProductById(int id)
        {
            return await _unitOfWork.GetRepository<Product>().Get(include: p => p.Include(p => p.Brand).Include(p => p.ChargerPort).Include(p => p.JackPlug).Include(p => p.OperatingSystemProduct).Include(p => p.Chip).Include(p => p.ScreenTechnology).Include(p => p.ProductColorProducts).ThenInclude(x => x.Photos).Include(p => p.ProductColorProducts).ThenInclude(x => x.ColorProduct).Include(p => p.ProductVersions).ThenInclude(x => x.Ram).Include(p => p.ProductVersions).ThenInclude(x => x.Rom).Include(p => p.ProductVersions).ThenInclude(x => x.ProductSamples),
                                                    filter: x => x.Id == id);

        }

        public async Task<IEnumerable<Order>> GetAllOrdersByClient(string UserId)
        {
            return await _unitOfWork.GetRepository<Order>().GetAll(filter: x => x.UserId == UserId, orderBy: x => x.OrderByDescending(x => x.Id),
                include: p => p.Include(p => p.OrderDetails).ThenInclude(x => x.ProductPurchaseOrderDetail)
                .Include(x => x.User).Include(x => x.Recipient).Include(x => x.OrderStatus).Include(x => x.PaymentMethod));
        }

        public async Task<Order> GetOrderByIdClient(int orderId, string userId)
        {
            return await _unitOfWork.GetRepository<Order>().Get(filter: x => x.Id == orderId && x.UserId == userId, include: p => p.Include(p => p.OrderDetails).ThenInclude(x => x.ProductPurchaseOrderDetail)
                 .Include(x => x.User).Include(x => x.Recipient).Include(x => x.OrderStatus).Include(x => x.PaymentMethod));
        }

        public async Task<IEnumerable<ProductSample>> GetAllProductSamples()
        {
            return await _unitOfWork.GetRepository<ProductSample>().GetAll(include: p => p.Include(p => p.ProductVersion).ThenInclude(r => r.Ram).Include(p => p.ProductVersion).ThenInclude(r => r.Rom).Include(p => p.ColorProduct).Include(p => p.ProductVersion),
             orderBy: x => x.OrderByDescending(x => x.Id));
        }

        public async Task<IEnumerable<Ram>> GetAllRams()
        {
            return await _unitOfWork.GetRepository<Ram>().GetAll();
        }

        public async Task<IEnumerable<OperatingSystemType>> GetAllOperatingSystemTypes()
        {
            return await _unitOfWork.GetRepository<OperatingSystemType>().GetAll();
        }

        public async Task<IEnumerable<Rom>> GetAllRoms()
        {
            return await _unitOfWork.GetRepository<Rom>().GetAll();
        }

        public async Task<IEnumerable<PromotionProduct>> GetAllPromotionProducts()
        {
            return await _unitOfWork.GetRepository<PromotionProduct>().GetAll(include: x => x.Include(x => x.PromotionProductDetails).ThenInclude(x => x.ProductVersion).ThenInclude(x => x.Product), filter: x => x.Disabled == false, orderBy: x => x.OrderByDescending(x => x.StartDate));

        }
        public async Task<IEnumerable<ShockDeal>> GelAllShockDeals()
        {
            return await _unitOfWork.GetRepository<ShockDeal>().GetAll(include: x => x.Include(x => x.ShockDealDetails).ThenInclude(x => x.MainProduct).Include(x => x.ShockDealDetails).ThenInclude(x => x.ProductShockDeal).ThenInclude(x=>x.ProductVersions), filter: x => x.Disabled == false, orderBy: x => x.OrderByDescending(x => x.StartDate));

        }
        public async Task<IEnumerable<ProductVersion>> GetAllProductVersions()
        {
            return await _unitOfWork.GetRepository<ProductVersion>().GetAll();
        }
    }
}
