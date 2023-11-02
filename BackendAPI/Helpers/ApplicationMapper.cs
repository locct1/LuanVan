using AutoMapper;
using BackendAPI.Data;
using BackendAPI.DTO.Admin;
using BackendAPI.DTO.Client;
using BackendAPI.Models.AdminAccount;
using BackendAPI.Models.ClientAccount;
using System.Data;
using static BackendAPI.DTO.Client.OperatingSystemProductModel;

namespace BackendAPI.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<Order, AdminOrderModel>().ReverseMap();

            CreateMap<ApplicationUser, UserModel>().ReverseMap();
            CreateMap<Recipient, RecipentModel>().ReverseMap();
            CreateMap<PaymentMethod, PaymentMethodModel>().ReverseMap();
            CreateMap<OrderStatus, OrderStatusModel>().ReverseMap();
            CreateMap<OrderDetail, OrderDetailModel>().ReverseMap();
            CreateMap<ProductPurchaseOrderDetail, ProductPurchaseOrderDetailModel>().ReverseMap();

            CreateMap<ReviewProduct, AdminReviewProductModel>().ReverseMap();

            CreateMap<Product, ProductReviewProductModel>().ReverseMap();
            CreateMap<FeedbackReviewProduct, FeedbackReviewProductModel>().ReverseMap();
            CreateMap<FeedbackReviewProduct, FeedbackReviewProductModel>().ReverseMap();
            CreateMap<LikeReviewProduct, LikeReviewProductModel>().ReverseMap();
            CreateMap<ReviewProductPhoto, ReviewProductPhotoModel>().ReverseMap();



            CreateMap<Product, ClientProductViewModel>().ReverseMap();
            CreateMap<Brand, BrandModel>().ReverseMap();
            CreateMap<WareHouse, WareHouseModel>().ReverseMap();
            CreateMap<ScreenTechnology, ScreenTechnologyModel>().ReverseMap();
            CreateMap<Chip, ChipModel>().ReverseMap();
            CreateMap<ChargerPort, ChargerPortModel>().ReverseMap();
            CreateMap<JackPlug, JackPlugModel>().ReverseMap();
            CreateMap<OperatingSystemProduct, OperatingSystemProductModel>().ReverseMap();
            CreateMap<ProductVersion, ProductVersionModel>().ReverseMap();
            CreateMap<ProductColorProduct, ProductColorProductModel>().ReverseMap();

            CreateMap<Ram, RamModel>().ReverseMap();
            CreateMap<Rom, RomModel>().ReverseMap();
            CreateMap<ProductSample, ProductSampleModel>().ReverseMap();
            CreateMap<PromotionProductDetail, PromotionProductDetailModel>().ReverseMap();

            CreateMap<ColorProduct, ColorProductModel>().ReverseMap();
            CreateMap<PromotionProduct, PromotionProductModel>().ReverseMap();
            CreateMap<Photo, PhotoModel>().ReverseMap();
            CreateMap<ChipType, ChipTypeModel>().ReverseMap();
            CreateMap<OperatingSystemType, OperatingSystemTypeModel>().ReverseMap();

            CreateMap<Chip, AdminChipModel>().ReverseMap();
            CreateMap<ChipType, AdminChipTypeModel>().ReverseMap();
            CreateMap<OperatingSystemProduct, AdminOperatingSystemProductModel>().ReverseMap();
            CreateMap<OperatingSystemType, AdminOperatingSystemTypeModel>().ReverseMap();



            CreateMap<ProductPurchaseOrder, AdminProductPurchageOrderModel>().ReverseMap();
            CreateMap<WareHouse, AdminWareHouseModel>().ReverseMap();
            CreateMap<Supplier, AdminSupplierModel>().ReverseMap();
            CreateMap<ProductPurchaseOrderDetail, AdminProductPurchaseOrderDetailModel>().ReverseMap();

            CreateMap<ProductSample, AdminProductSampleModel>().ReverseMap();
            CreateMap<ProductVersion, AdminSPProductVersionModel>().ReverseMap();
            CreateMap<Product, AdminSPProductModel>().ReverseMap();





        }
    }
}
