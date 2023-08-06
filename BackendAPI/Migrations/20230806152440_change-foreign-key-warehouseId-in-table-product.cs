using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changeforeignkeywarehouseIdintableproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_WareHouse_WareHouseId",
                table: "Product");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_WareHouse_WareHouseId",
                table: "Product",
                column: "WareHouseId",
                principalTable: "WareHouse",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_WareHouse_WareHouseId",
                table: "Product");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_WareHouse_WareHouseId",
                table: "Product",
                column: "WareHouseId",
                principalTable: "WareHouse",
                principalColumn: "Id");
        }
    }
}
