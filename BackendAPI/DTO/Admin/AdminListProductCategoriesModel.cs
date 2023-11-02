using System.ComponentModel.DataAnnotations;

namespace BackendAPI.DTO.Admin
{
    public class AdminListProductCategoriesModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public double Total { get; set; }
    }
}
