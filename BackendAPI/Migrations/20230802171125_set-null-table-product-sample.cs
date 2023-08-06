using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class setnulltableproductsample : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductSample_ColorProduct_ColorProductId",
                table: "ProductSample");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductSample_Product_ProductId",
                table: "ProductSample");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSample_ColorProduct_ColorProductId",
                table: "ProductSample",
                column: "ColorProductId",
                principalTable: "ColorProduct",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSample_Product_ProductId",
                table: "ProductSample",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductSample_ColorProduct_ColorProductId",
                table: "ProductSample");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductSample_Product_ProductId",
                table: "ProductSample");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSample_ColorProduct_ColorProductId",
                table: "ProductSample",
                column: "ColorProductId",
                principalTable: "ColorProduct",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSample_Product_ProductId",
                table: "ProductSample",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id");
        }
    }
}
