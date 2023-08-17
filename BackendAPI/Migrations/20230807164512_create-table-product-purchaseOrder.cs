using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtableproductpurchaseOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductPurchaseOrder",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WareHouseId = table.Column<int>(type: "int", nullable: true),
                    SupplierId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StatusId = table.Column<int>(type: "int", nullable: false),
                    Total = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPurchaseOrder", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPurchaseOrder_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ProductPurchaseOrder_Supplier_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Supplier",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ProductPurchaseOrder_WareHouse_WareHouseId",
                        column: x => x.WareHouseId,
                        principalTable: "WareHouse",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ProductPurchaseOrderDetail",
                columns: table => new
                {
                    ProductSampleId = table.Column<int>(type: "int", nullable: false),
                    ProductPurchaseOrderId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Imei = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PriceIn = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPurchaseOrderDetail", x => new { x.ProductPurchaseOrderId, x.ProductSampleId });
                    table.ForeignKey(
                        name: "FK_ProductPurchaseOrderDetail_ProductPurchaseOrder_ProductPurchaseOrderId",
                        column: x => x.ProductPurchaseOrderId,
                        principalTable: "ProductPurchaseOrder",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductPurchaseOrderDetail_ProductSample_ProductSampleId",
                        column: x => x.ProductSampleId,
                        principalTable: "ProductSample",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductPurchaseOrder_SupplierId",
                table: "ProductPurchaseOrder",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPurchaseOrder_UserId",
                table: "ProductPurchaseOrder",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPurchaseOrder_WareHouseId",
                table: "ProductPurchaseOrder",
                column: "WareHouseId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPurchaseOrderDetail_ProductSampleId",
                table: "ProductPurchaseOrderDetail",
                column: "ProductSampleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductPurchaseOrderDetail");

            migrationBuilder.DropTable(
                name: "ProductPurchaseOrder");
        }
    }
}
