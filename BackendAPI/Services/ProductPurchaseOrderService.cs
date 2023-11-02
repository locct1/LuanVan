using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class ProductPurchaseOrderService : IProductPurchaseOrderService

    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductPurchaseOrderService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateProductPurchaseOrder(ProductPurchaseOrder productPurchaseOrder)
        {
            await _unitOfWork.GetRepository<ProductPurchaseOrder>().Insert(productPurchaseOrder);
        }

        public async Task<IEnumerable<ProductPurchaseOrder>> GetAll()
        {
            return await _unitOfWork.GetRepository<ProductPurchaseOrder>().GetAll(include: p => p.Include(x => x.Supplier).Include(a => a.WareHouse).Include(a => a.User), orderBy: x => x.OrderByDescending(x => x.Id));
        }

        public async Task<IEnumerable<Product>> GetAllProductByWareHouseId(int id)
        {
            return await _unitOfWork.GetRepository<Product>().GetAll(filter: x => x.WareHouseId == id,
                include: p => p.Include(p => p.ProductColorProducts).ThenInclude(x=>x.ColorProduct).Include(x=>x.ProductVersions).ThenInclude(x=>x.Ram).Include(x => x.ProductVersions).ThenInclude(x => x.Rom));

        }

        public async Task<ProductPurchaseOrder> GetProductPurchaseOrderById(int id)
        {

            var product = await _unitOfWork.GetRepository<ProductPurchaseOrder>()
                                    .Get(include: p => p.Include(p => p.ProductPurchaseOrderDetails)
                                    .Include(x => x.Supplier)
                                    .Include(a => a.WareHouse).Include(a => a.User), filter: x => x.Id == id);

            return product;

        }
    }
}
