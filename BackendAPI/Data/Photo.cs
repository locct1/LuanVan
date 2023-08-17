
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("Photo")]

    public class Photo
    {
        [Key]
        public int Id { get; set; }
        public string FileName { get; set; }
        public Product? Product { get; set; }
        [ForeignKey(nameof(ProductId))]
        public int? ProductId { get; set; }
        [ForeignKey(nameof(ProductSampleId))]
        public ProductSample? ProductSample { get; set; }
        public int? ProductSampleId { get; set; }

    }
}
