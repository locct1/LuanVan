using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("ProductColorProduct")]
    public class ProductColorProduct
    {
        [Key]
        public int Id { get; set; }
        public string? FileName { get; set; }
        public Product? Product { get; set; }
        [ForeignKey(nameof(ProductId))]
        public int? ProductId { get; set; }
        public ColorProduct? ColorProduct { get; set; }
        [ForeignKey(nameof(ColorProductId))]
        public int? ColorProductId { get; set; }
        public List<Photo> Photos { get; set; }
    }
}
