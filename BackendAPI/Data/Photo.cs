
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("Photo")]

    public class Photo
    {
        [Key]
        public int Id { get; set; }
        public string? FileName { get; set; }
        public Product? Product { get; set; }
        [ForeignKey(nameof(ProductId))]
        public int? ProductId { get; set; }
        public ProductColorProduct? ProductColorProduct { get; set; }
        [ForeignKey(nameof(ProductColorProductId))]
        public int? ProductColorProductId { get; set; }

    }
}
