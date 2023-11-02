using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Data
{
    [Table("ShockDealDetail")]
    public class ShockDealDetail
    {
        [Key]
        public int Id { get; set; }
        public int? MainProductId { get; set; }
        [ForeignKey(nameof(MainProductId))]
        public Product? MainProduct { get; set; }
        public int? ShockDealProductId { get; set; }
        [ForeignKey(nameof(ShockDealProductId))]
        public Product? ProductShockDeal { get; set; }
        public int? ShockDealId { get; set; }
        [ForeignKey(nameof(ShockDealId))]
        public ShockDeal? ShockDeal { get; set; }

        public double ShockDealPrice { get; set; }
    }
}
