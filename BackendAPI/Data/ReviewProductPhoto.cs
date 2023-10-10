using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("ReviewProductPhoto")]
    public class ReviewProductPhoto
    {
        [Key]
        public int Id { get; set; }
        public string FileName { get; set; }
        public int? ReviewProductId { get; set; }
        [ForeignKey(nameof(ReviewProductId))]
        public ReviewProduct? ReviewProduct { get; set; }
    }
}
