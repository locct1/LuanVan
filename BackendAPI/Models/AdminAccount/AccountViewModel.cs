namespace BackendAPI.Models.AdminAccount
{
    public class AccountViewModel
    {
        public string? Id { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string FullName { get; set; }
        public string? Address { get; set; }
        public string? WardCode { get; set; }
        public string? HouseNumberAndStreet { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public int? DistrictID { get; set; }
        public int? ProvinceID { get; set; }
        public bool Disabled { get; set; }
        public List<string> RoleNames { get; set; }

    }
}
