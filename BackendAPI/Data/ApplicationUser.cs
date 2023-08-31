﻿using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendAPI.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string FullName { get; set; }
        public string? Address { get; set; }
        public bool Disabled { get; set; }
        public List<ProductPurchaseOrder>? ProductPurchaseOrders { get; set; }
        public List<Order>? Orders { get; set; }

    }
}
