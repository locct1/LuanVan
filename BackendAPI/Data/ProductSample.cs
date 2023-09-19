using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    [Table("ProductSample")]
    public class ProductSample
    {
        [Key]
        public int Id { get; set; }
        public int Quantity { get; set; }
        public ProductVersion? ProductVersion { get; set; }
        [ForeignKey(nameof(ProductVersionId))]
        public int? ProductVersionId { get; set; }
        public ColorProduct? ColorProduct { get; set; }
        [ForeignKey(nameof(ColorProductId))]
        public int? ColorProductId { get; set; }
        public bool Disabled { get; set; }
        public List<Photo> Photos { get; set; }
    }
}
