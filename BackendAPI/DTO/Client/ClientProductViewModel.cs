using BackendAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BackendAPI.DTO.Admin;

namespace BackendAPI.DTO.Client
{
    public class ClientProductViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Disabled { get; set; }
        public int Quantity { get; set; }
        public int? BrandId { get; set; }
        public BrandModel? Brand { get; set; }
        public WareHouseModel? WareHouse { get; set; }
        public int? WareHouseId { get; set; }
        public string Image { get; set; }
        public string Infomation { get; set; }
        public bool IsVersionRam { get; set; }
        public string? Resolution { get; set; }
        public double? ScreenWidth { get; set; }
        public string? FrontCamera { get; set; }
        public string? RearCamera { get; set; }
        public int? Battery { get; set; }
        public string? Sim { get; set; }
        public int? Charging { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public int? HeadPhoneTime { get; set; }
        public int? Length { get; set; }
        public int? Width { get; set; }
        public ScreenTechnologyModel? ScreenTechnology { get; set; }

        public int? ScreenTechnologyId { get; set; }
        public ChipModel? Chip { get; set; }
        public int? ChipId { get; set; }
        public ChargerPortModel? ChargerPort { get; set; }
        public int? ChargerPortId { get; set; }
        public JackPlugModel? JackPlug { get; set; }
        public int? JackPlugId { get; set; }
        public string? ProductCategoryCode { get; set; }
        public OperatingSystemProductModel? OperatingSystemProduct { get; set; }
        public int? OperatingSystemProductId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<ProductVersionModel>? ProductVersions { get; set; }
        public List<ProductColorProductModel>? ProductColorProducts { get; set; }
        public List<AdminReviewProductModel>? ReviewProducts { get; set; }

    }
    public class ProductColorProductModel
    {
        public int Id { get; set; }
        public string? FileName { get; set; }
        public int? ProductId { get; set; }
        public ColorProductModel? ColorProduct { get; set; }
        public int? ColorProductId { get; set; }
        public List<PhotoModel> Photos { get; set; }
    }
    public class ProductVersionModel
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public RamModel? Ram { get; set; }
        public int? RamId { get; set; }
        public RomModel? Rom { get; set; }
        public int? RomId { get; set; }
        public double PriceIn { get; set; }
        public double PriceOut { get; set; }
        //public List<ProductSampleModel>? ProductSamples { get; set; }
        //public List<PromotionProductDetailModel>? PromotionProductDetails { get; set; }
    }
    public class ColorProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CodeColor { get; set; }
    }
    public class PromotionProductDetailModel
    {
        public int Id { get; set; }
        public int? PromotionProductId { get; set; }
        public PromotionProductModel? PromotionProduct { get; set; }
        public int? ProductVersionId { get; set; }
        public ProductVersionModel? ProductVersion { get; set; }
        public double DiscountedPrice { get; set; }
    }
    public class PromotionProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Disabled { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
    public class PhotoModel
    {
        public int Id { get; set; }
        public string? FileName { get; set; }
        public int? ProductId { get; set; }
        public int? ProductColorProductId { get; set; }
    }
    public class ProductSampleModel
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int? ProductVersionId { get; set; }
        public ProductVersionModel? ProductVersion { get; set; }
        public ColorProductModel? ColorProduct { get; set; }
        public int? ColorProductId { get; set; }
        public bool Disabled { get; set; }
        public List<PhotoModel> Photos { get; set; }
    }
    public class RamModel
    {
        public int Id { get; set; }
        public int Name { get; set; }
    }
    public class RomModel
    {
        public int Id { get; set; }
        public int Name { get; set; }
    }
    public class BrandModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public bool Disabled { get; set; }
    }
    public class WareHouseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
    }
    public class ScreenTechnologyModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class ChipModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ChipTypeModel? ChipType { get; set; }
    }
    public class ChipTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class ChargerPortModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class JackPlugModel
    {

        public int Id { get; set; }
        public string Name { get; set; }

    }
    public class OperatingSystemProductModel
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public int? OperatingSystemTypeId { get; set; }
        public OperatingSystemTypeModel? OperatingSystemType { get; set; }


        public class OperatingSystemTypeModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
    }
}
