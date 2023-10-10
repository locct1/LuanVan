using System.ComponentModel.DataAnnotations;

namespace BackendAPI.Models.ClientAccount
{
    public class ClientViewModel
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string WareCode { get; set; }
        public int DistrictID { get; set; }
        public int ProvinceID { get; set; }
        public bool Disabled { get; set; }
        public string HouseNumberAndStreet { get; set; }

    }
}
