using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changetablepromotionproductdetail_03_11_02 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ColorProductId",
                table: "PromotionProductDetail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PromotionProductDetail_ColorProductId",
                table: "PromotionProductDetail",
                column: "ColorProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionProductDetail_ColorProduct_ColorProductId",
                table: "PromotionProductDetail",
                column: "ColorProductId",
                principalTable: "ColorProduct",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PromotionProductDetail_ColorProduct_ColorProductId",
                table: "PromotionProductDetail");

            migrationBuilder.DropIndex(
                name: "IX_PromotionProductDetail_ColorProductId",
                table: "PromotionProductDetail");

            migrationBuilder.DropColumn(
                name: "ColorProductId",
                table: "PromotionProductDetail");
        }
    }
}
