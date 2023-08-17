namespace BackendAPI.Models.AdminAccount
{
    public class AdminViewModel
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public bool Disabled { get; set; }
    }
}
