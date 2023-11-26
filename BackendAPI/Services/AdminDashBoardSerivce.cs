using BackendAPI.Data;
using BackendAPI.DTO.Admin;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.UnitOfWorks;
using Microsoft.EntityFrameworkCore;

namespace BackendAPI.Services
{
    public class AdminDashBoardSerivce : IAdminDashBoardService

    {
        private readonly IUnitOfWork _unitOfWork;
        public AdminDashBoardSerivce(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Response> GetAll()
        {
            var amountOfProducts = _unitOfWork.GetRepository<Product>().Count();
            var amountOfBrands = _unitOfWork.GetRepository<Brand>().Count();
            var allBrands = await _unitOfWork.GetRepository<Brand>().GetAll();
            var allWareHouses = await _unitOfWork.GetRepository<WareHouse>().GetAll();
            var amountOfProductSamples = _unitOfWork.GetRepository<ProductSample>().Count();
            var amountOfProductSamplePhones = _unitOfWork.GetRepository<ProductSample>().Count(x => x.ProductVersion.Product.ProductCategoryCode == "DIENTHOAI");
            var amountOfProductSampleAccessories = _unitOfWork.GetRepository<ProductSample>().Count(x => x.ProductVersion.Product.ProductCategoryCode != "DIENTHOAI");
            var amountOfAccounts = _unitOfWork.GetRepository<ApplicationUser>().Count();
            var amountOfColorProducts = _unitOfWork.GetRepository<ColorProduct>().Count();
            var amountOfWareHouses = _unitOfWork.GetRepository<WareHouse>().Count();
            var amountOfSuppliers = _unitOfWork.GetRepository<Supplier>().Count();
            var amountOfPhones = _unitOfWork.GetRepository<Product>().Count(x => x.ProductCategoryCode == "DIENTHOAI");
            var amountOfAccessories = _unitOfWork.GetRepository<Product>().Count(x => x.ProductCategoryCode != "DIENTHOAI");
            var amountOfProductCategories = _unitOfWork.GetRepository<ProductCategory>().Count();
            var totalOfProductPurchaseOrders = _unitOfWork.GetRepository<ProductPurchaseOrder>().Sum(null, x => (decimal)x.Total);
            var productCategories = await _unitOfWork.GetRepository<ProductCategory>().GetAll();
            var totalOfOrders = _unitOfWork.GetRepository<Order>().Sum(x => x.OrderStatusId != 6, x => (decimal)x.Total);
            List<AdminListProductCategoriesModel> productList = new List<AdminListProductCategoriesModel>();
            List<object> totalProductSamplesByBrands = new List<object>();
            List<object> totalProductSamplesByWareHouses = new List<object>();
            List<AdminTotalListProductSamplesModel> productTotalListProductSamples = new List<AdminTotalListProductSamplesModel>();
            foreach (var item in productCategories)
            {
                var amountProduct = _unitOfWork.GetRepository<Product>().Count(x => x.ProductCategoryCode == item.Code);
                var newProductCategory = new AdminListProductCategoriesModel
                {
                    Id = item.Id,
                    Name = item.Name,
                    Code = item.Code,
                    Total = amountProduct
                };
                var amountProductSample = _unitOfWork.GetRepository<ProductSample>().Count(x => x.ProductVersion.Product.ProductCategoryCode == item.Code);
                var newProductSample = new AdminTotalListProductSamplesModel
                {
                    Id = item.Id,
                    Name = item.Name,
                    Code = item.Code,
                    Total = amountProductSample
                };
                productList.Add(newProductCategory);
                productTotalListProductSamples.Add(newProductSample);
            }
            foreach (var item in allBrands)
            {
                var amountProductSample = _unitOfWork.GetRepository<ProductSample>().Count(x => x.ProductVersion.Product.Brand.Id == item.Id);
                var newProductSample = new
                {
                    Id = item.Id,
                    Name = item.Name,
                    Total = amountProductSample
                };

                totalProductSamplesByBrands.Add(newProductSample);
            }
            foreach (var item in allWareHouses)
            {
                var amountProductSample = _unitOfWork.GetRepository<ProductSample>().Sum(x => x.ProductVersion.Product.WareHouse.Id == item.Id, x => x.Quantity);
                var newProductSample = new
                {
                    Id = item.Id,
                    Name = item.Name,
                    Total = amountProductSample
                };

                totalProductSamplesByWareHouses.Add(newProductSample);
            }
            var promotionProducts = await _unitOfWork.GetRepository<PromotionProduct>().GetAll(include: x => x.Include(x => x.PromotionProductDetails).ThenInclude(x => x.ProductVersion).ThenInclude(x => x.Product).Include(x => x.PromotionProductDetails).ThenInclude(x => x.ColorProduct).Include(x => x.PromotionProductDetails).ThenInclude(x => x.ProductVersion).ThenInclude(x => x.Ram).Include(x => x.PromotionProductDetails).ThenInclude(x => x.ProductVersion).ThenInclude(x => x.Rom), filter: x => x.Disabled == false, orderBy: x => x.OrderByDescending(x => x.StartDate)); ;
            var currentDate = DateTime.Now;

            // Lọc danh sách sản phẩm dựa trên ngày hiện tại
            var filteredPromotionProducts = promotionProducts
                .Where(product => currentDate >= product.StartDate && currentDate <= product.EndDate)
                .ToList();
            var amountOfOrdersCompleted= _unitOfWork.GetRepository<Order>().Count(x=>x.OrderStatusId==4);
            var amountOfOrdersCanceled = _unitOfWork.GetRepository<Order>().Count(x => x.OrderStatusId == 6);
            var amountOfOrders = _unitOfWork.GetRepository<Order>().Count();
            return (new Response
            {
                Success = true,
                Message = "Thành công",
                Data = new
                {
                    AmountOfOrdersCompleted = amountOfOrdersCompleted,
                    AmountOfOrdersCanceled = amountOfOrdersCanceled,
                    AmountOfOrders = amountOfOrders,
                    ListPromotionProducts = filteredPromotionProducts,
                    TotalOfOrders = totalOfOrders,
                    TotalOfProductPurchaseOrders = totalOfProductPurchaseOrders,
                    AmountOfProducts = amountOfProducts,
                    AmountOfProductSampleAccessories = amountOfProductSampleAccessories,
                    AmountOfBrands = amountOfBrands,
                    AmountOfProductSamples = amountOfProductSamples,
                    AmountOfAccounts = amountOfAccounts,
                    AmountOfColorProducts = amountOfColorProducts,
                    AmountOfSuppliers = amountOfSuppliers,
                    AmountOfWareHouses = amountOfWareHouses,
                    AmountOfAccessories = amountOfAccessories,
                    AmountOfPhones = amountOfPhones,
                    TotalListProductCategories = productList,
                    AmountOfProductCategories = amountOfProductCategories,
                    AmountOfProductSamplePhones = amountOfProductSamplePhones,
                    TotalListProductSamples = productTotalListProductSamples,
                    TotalProductSamplesByBrands = totalProductSamplesByBrands,
                    TotalProductSamplesByWareHouses = totalProductSamplesByWareHouses,
                }
            });
        }
    }
}
