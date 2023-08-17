using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class _1changetablephoto : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photo_Product_ProductId",
                table: "Photo");

            migrationBuilder.DropForeignKey(
                name: "FK_Photo_ProductSample_ProductSampleId",
                table: "Photo");

            migrationBuilder.AlterColumn<int>(
                name: "ProductSampleId",
                table: "Photo",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "Photo",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_Product_ProductId",
                table: "Photo",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_ProductSample_ProductSampleId",
                table: "Photo",
                column: "ProductSampleId",
                principalTable: "ProductSample",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photo_Product_ProductId",
                table: "Photo");

            migrationBuilder.DropForeignKey(
                name: "FK_Photo_ProductSample_ProductSampleId",
                table: "Photo");

            migrationBuilder.AlterColumn<int>(
                name: "ProductSampleId",
                table: "Photo",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "Photo",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_Product_ProductId",
                table: "Photo",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_ProductSample_ProductSampleId",
                table: "Photo",
                column: "ProductSampleId",
                principalTable: "ProductSample",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
