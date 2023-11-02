using BackendAPI.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BackendAPI.DTO.Client;

namespace BackendAPI.DTO.Admin
{
    public class AdminProductSampleModel
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public AdminSPProductVersionModel? ProductVersion { get; set; }
        public int? ProductVersionId { get; set; }
        public ColorProductModel? ColorProduct { get; set; }
        public int? ColorProductId { get; set; }
        public bool Disabled { get; set; }
    }
    public class AdminSPProductVersionModel
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public RamModel? Ram { get; set; }
        public int? RamId { get; set; }
        public RomModel? Rom { get; set; }
        public AdminSPProductModel? Product { get; set; }

        public int? RomId { get; set; }
        public double PriceIn { get; set; }
        public double PriceOut { get; set; }
    }
    public class AdminSPProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public WareHouseModel? WareHouse { get; set; }
        public bool Disabled { get; set; }
    }
}
