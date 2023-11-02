using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackendAPI.Data
{
    [Table("Product")]

    public class Product
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Disabled { get; set; }
        public int Quantity { get; set; }
        public int? BrandId { get; set; }
        [ForeignKey(nameof(BrandId))]
        public Brand? Brand { get; set; }
        public WareHouse? WareHouse { get; set; }
        [ForeignKey(nameof(WareHouseId))]
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
        public ScreenTechnology? ScreenTechnology { get; set; }
        [ForeignKey(nameof(ScreenTechnologyId))]

        public int? ScreenTechnologyId { get; set; }
        public Chip? Chip { get; set; }
        [ForeignKey(nameof(ChipId))]
        public int? ChipId { get; set; }
        public ChargerPort? ChargerPort { get; set; }
        [ForeignKey(nameof(ChargerPortId))]
        public int? ChargerPortId { get; set; }
        public JackPlug? JackPlug { get; set; }
        [ForeignKey(nameof(JackPlugId))]
        public int? JackPlugId { get; set; }
        public string? ProductCategoryCode { get; set; }
        public OperatingSystemProduct? OperatingSystemProduct { get; set; }
        [ForeignKey(nameof(OperatingSystemProductId))]
        public int? OperatingSystemProductId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<ProductVersion>? ProductVersions { get; set; }
        public List<ProductColorProduct>? ProductColorProducts { get; set; }
        public List<ReviewProduct>? ReviewProducts { get; set; }

    }
}
