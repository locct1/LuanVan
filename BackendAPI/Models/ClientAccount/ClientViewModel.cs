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
        public bool Disabled { get; set; }
    }
}
