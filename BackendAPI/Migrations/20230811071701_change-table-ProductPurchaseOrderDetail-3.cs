using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changetableProductPurchaseOrderDetail3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductPurchaseOrderDetail",
                table: "ProductPurchaseOrderDetail");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductPurchaseOrderDetail",
                table: "ProductPurchaseOrderDetail",
                columns: new[] { "ProductPurchaseOrderId", "ProductSampleId", "Id" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductPurchaseOrderDetail",
                table: "ProductPurchaseOrderDetail");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductPurchaseOrderDetail",
                table: "ProductPurchaseOrderDetail",
                columns: new[] { "ProductPurchaseOrderId", "ProductSampleId" });
        }
    }
}
