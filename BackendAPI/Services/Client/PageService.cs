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
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse), orderBy: x => x.OrderByDescending(x => x.Id));
        }

        public async Task<IEnumerable<Product>> GetAllProductsByBrandId(int id)
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse), orderBy: x => x.OrderByDescending(x => x.Id), filter: x => x.BrandId == id);

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
            return await _unitOfWork.GetRepository<Product>().Get(include: p => p.Include(p => p.Brand).Include(p => p.WareHouse)
                                                    .Include(p => p.ProductSamples).ThenInclude(p => p.ColorProduct)
                                                    .Include(p => p.ProductSamples).ThenInclude(s => s.Photos),
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
    }
}
