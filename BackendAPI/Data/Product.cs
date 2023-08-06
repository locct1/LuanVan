using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("Product")]

    public class Product
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int? BrandId { get; set; }
        public bool Disabled { get; set; }
        public int Quantity { get; set; }
        [ForeignKey(nameof(BrandId))]
        public Brand? Brand { get; set; }
        public int? WareHouseId { get; set; }
        [ForeignKey(nameof(WareHouseId))]
        public WareHouse? WareHouse { get; set; }
        public double PriceIn { get; set; }
        public double PriceOut { get; set; }
        public string Image { get; set; }
        public string Infomation { get; set; }
        public string TechnicalDetail { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<ProductSample> ProductSamples { get; set; }

    }
}
