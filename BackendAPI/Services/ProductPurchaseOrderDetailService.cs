using BackendAPI.Data;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;

namespace BackendAPI.Services
{
    public class ProductPurchaseOrderDetailService : IProductPurchaseOrderDetailService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductPurchaseOrderDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateProductPurchaseOrderDetail(ProductPurchaseOrderDetail productPurchaseOrderDetail)
        {
            await _unitOfWork.GetRepository<ProductPurchaseOrderDetail>().Insert(productPurchaseOrderDetail);
        }

        public async Task<ProductPurchaseOrderDetail> GetProductPurchaseOrderDetailById(int id)
        {
            return await _unitOfWork.GetRepository<ProductPurchaseOrderDetail>().Get(filter: x => x.Id == id);

        }
        public async Task<ProductPurchaseOrderDetail> GetProductPurchaseOrderDetailFirstĐefaultByStatus(int ProductSampleId)
        {
            return await _unitOfWork.GetRepository<ProductPurchaseOrderDetail>().Get(filter: x => x.StatusId == 0 && x.ProductSampleId == ProductSampleId);
        }
        public async Task UpdateProductPurchaseOrderDetail(int id, ProductPurchaseOrderDetail productPurchaseOrderDetail)
        {
            await _unitOfWork.GetRepository<ProductPurchaseOrderDetail>().Update(productPurchaseOrderDetail);

        }
    }
}
