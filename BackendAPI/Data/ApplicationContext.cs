using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Diagnostics;

namespace BackendAPI.Data
{
    public class ApplicationContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> opt) : base(opt)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Product>()
               .HasOne(b => b.Brand)
               .WithMany(a => a.Products)
               .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<PromotionProductDetail>()
               .HasOne(b => b.ProductVersion)
               .WithMany(a => a.PromotionProductDetails)
               .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<ProductSample>()
                .HasOne(b => b.ProductVersion)
                .WithMany(a => a.ProductSamples)
                .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<ProductSample>()
              .HasOne(b => b.ColorProduct)
              .WithMany(a => a.ProductSamples)
              .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<Product>()
             .HasOne(b => b.WareHouse)
             .WithMany(a => a.Products)
             .OnDelete(DeleteBehavior.SetNull);


            modelBuilder.Entity<ProductPurchaseOrder>()
           .HasOne(b => b.WareHouse)
           .WithMany(a => a.ProductPurchaseOrders)
           .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<ProductPurchaseOrder>()
          .HasOne(b => b.Supplier)
          .WithMany(a => a.ProductPurchaseOrders)
          .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<ProductPurchaseOrder>()
         .HasOne(b => b.User)
         .WithMany(a => a.ProductPurchaseOrders)
         .OnDelete(DeleteBehavior.SetNull);
            //modelBuilder.Entity<ProductPurchaseOrderDetail>(entity =>
            //{
            //    entity.HasKey(c => new { c.ProductPurchaseOrderId, c.ProductSampleId, c.Id });
            //});

            //modelBuilder.Entity<OrderDetail>(entity =>
            //{
            //    entity.HasKey(c => new { c.OrderId, c.ProductPurchaseOrderDetailId, c.Id });
            //});
        }
        public DbSet<Brand>? Brands { get; set; }
        public DbSet<Chip>? Chips { get; set; }
        public DbSet<ChipType>? ChipTypes { get; set; }
        public DbSet<ScreenTechnology>? ScreenTechnologies { get; set; }
        public DbSet<OperatingSystemType>? OperatingSystemTypes { get; set; }
        public DbSet<OperatingSystemProduct>? OperatingSystems { get; set; }
        public DbSet<Ram>? Rams { get; set; }
        public DbSet<Rom>? Roms { get; set; }
        public DbSet<Supplier>? Suppliers { get; set; }
        public DbSet<WareHouse>? WareHouses { get; set; }
        public DbSet<ColorProduct>? ColorProducts { get; set; }

    }
}
