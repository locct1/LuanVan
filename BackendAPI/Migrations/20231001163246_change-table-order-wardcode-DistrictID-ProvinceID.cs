using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changetableorderwardcodeDistrictIDProvinceID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DistrictID",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProvinceID",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WardCode",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DistrictID",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "ProvinceID",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "WardCode",
                table: "Order");
        }
    }
}
