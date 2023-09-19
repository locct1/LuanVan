using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtableproductversion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductSample_Product_ProductId",
                table: "ProductSample");

            migrationBuilder.DropColumn(
                name: "PriceIn",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "PriceOut",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "ProductSample",
                newName: "ProductVersionId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductSample_ProductId",
                table: "ProductSample",
                newName: "IX_ProductSample_ProductVersionId");

            migrationBuilder.RenameColumn(
                name: "TechnicalDetail",
                table: "Product",
                newName: "Sim");

            migrationBuilder.AddColumn<string>(
                name: "Battery",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Charging",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ChipId",
                table: "Product",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FrontCamera",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsVersionRam",
                table: "Product",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "OperatingSystemProductId",
                table: "Product",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RearCamera",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Resolution",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ScreenTechnologyId",
                table: "Product",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ScreenWidth",
                table: "Product",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ProductVersion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    RamId = table.Column<int>(type: "int", nullable: true),
                    RomId = table.Column<int>(type: "int", nullable: true),
                    PriceIn = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PriceOut = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVersion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVersion_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductVersion_Ram_RamId",
                        column: x => x.RamId,
                        principalTable: "Ram",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProductVersion_Rom_RomId",
                        column: x => x.RomId,
                        principalTable: "Rom",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_ChipId",
                table: "Product",
                column: "ChipId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_OperatingSystemProductId",
                table: "Product",
                column: "OperatingSystemProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_ScreenTechnologyId",
                table: "Product",
                column: "ScreenTechnologyId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersion_ProductId",
                table: "ProductVersion",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersion_RamId",
                table: "ProductVersion",
                column: "RamId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVersion_RomId",
                table: "ProductVersion",
                column: "RomId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Chip_ChipId",
                table: "Product",
                column: "ChipId",
                principalTable: "Chip",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_OperatingSystemProduct_OperatingSystemProductId",
                table: "Product",
                column: "OperatingSystemProductId",
                principalTable: "OperatingSystemProduct",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_ScreenTechnology_ScreenTechnologyId",
                table: "Product",
                column: "ScreenTechnologyId",
                principalTable: "ScreenTechnology",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSample_ProductVersion_ProductVersionId",
                table: "ProductSample",
                column: "ProductVersionId",
                principalTable: "ProductVersion",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_Chip_ChipId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_OperatingSystemProduct_OperatingSystemProductId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_ScreenTechnology_ScreenTechnologyId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductSample_ProductVersion_ProductVersionId",
                table: "ProductSample");

            migrationBuilder.DropTable(
                name: "ProductVersion");

            migrationBuilder.DropIndex(
                name: "IX_Product_ChipId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_OperatingSystemProductId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_ScreenTechnologyId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Battery",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Charging",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ChipId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "FrontCamera",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "IsVersionRam",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "OperatingSystemProductId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "RearCamera",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "Resolution",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ScreenTechnologyId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ScreenWidth",
                table: "Product");

            migrationBuilder.RenameColumn(
                name: "ProductVersionId",
                table: "ProductSample",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductSample_ProductVersionId",
                table: "ProductSample",
                newName: "IX_ProductSample_ProductId");

            migrationBuilder.RenameColumn(
                name: "Sim",
                table: "Product",
                newName: "TechnicalDetail");

            migrationBuilder.AddColumn<double>(
                name: "PriceIn",
                table: "Product",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PriceOut",
                table: "Product",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductSample_Product_ProductId",
                table: "ProductSample",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
