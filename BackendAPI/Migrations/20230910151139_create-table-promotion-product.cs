using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtablepromotionproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PromotionProduct",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionProduct", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PromotionProductDetail",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PromotionProductId = table.Column<int>(type: "int", nullable: true),
                    ProductVersionId = table.Column<int>(type: "int", nullable: true),
                    DiscountedPrice = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromotionProductDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PromotionProductDetail_ProductVersion_ProductVersionId",
                        column: x => x.ProductVersionId,
                        principalTable: "ProductVersion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_PromotionProductDetail_PromotionProduct_PromotionProductId",
                        column: x => x.PromotionProductId,
                        principalTable: "PromotionProduct",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PromotionProductDetail_ProductVersionId",
                table: "PromotionProductDetail",
                column: "ProductVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionProductDetail_PromotionProductId",
                table: "PromotionProductDetail",
                column: "PromotionProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PromotionProductDetail");

            migrationBuilder.DropTable(
                name: "PromotionProduct");
        }
    }
}
