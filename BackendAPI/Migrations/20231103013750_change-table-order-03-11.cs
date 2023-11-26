using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changetableorder0311 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "PromotionProductDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PromotionProductDetailId",
                table: "OrderDetail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetail_PromotionProductDetailId",
                table: "OrderDetail",
                column: "PromotionProductDetailId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderDetail_PromotionProductDetail_PromotionProductDetailId",
                table: "OrderDetail",
                column: "PromotionProductDetailId",
                principalTable: "PromotionProductDetail",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderDetail_PromotionProductDetail_PromotionProductDetailId",
                table: "OrderDetail");

            migrationBuilder.DropIndex(
                name: "IX_OrderDetail_PromotionProductDetailId",
                table: "OrderDetail");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "PromotionProductDetail");

            migrationBuilder.DropColumn(
                name: "PromotionProductDetailId",
                table: "OrderDetail");
        }
    }
}
