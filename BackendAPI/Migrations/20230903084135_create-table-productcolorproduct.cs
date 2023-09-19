using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtableproductcolorproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "ProductSample");

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "Photo",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "ProductColorProductId",
                table: "Photo",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductColorProduct",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    ColorProductId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductColorProduct", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductColorProduct_ColorProduct_ColorProductId",
                        column: x => x.ColorProductId,
                        principalTable: "ColorProduct",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductColorProduct_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Photo_ProductColorProductId",
                table: "Photo",
                column: "ProductColorProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductColorProduct_ColorProductId",
                table: "ProductColorProduct",
                column: "ColorProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductColorProduct_ProductId",
                table: "ProductColorProduct",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photo_ProductColorProduct_ProductColorProductId",
                table: "Photo",
                column: "ProductColorProductId",
                principalTable: "ProductColorProduct",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photo_ProductColorProduct_ProductColorProductId",
                table: "Photo");

            migrationBuilder.DropTable(
                name: "ProductColorProduct");

            migrationBuilder.DropIndex(
                name: "IX_Photo_ProductColorProductId",
                table: "Photo");

            migrationBuilder.DropColumn(
                name: "ProductColorProductId",
                table: "Photo");

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "ProductSample",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "Photo",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
