using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class addwidthheighttotableorder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Height",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Length",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Width",
                table: "Order",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Height",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Length",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Width",
                table: "Order");
        }
    }
}
