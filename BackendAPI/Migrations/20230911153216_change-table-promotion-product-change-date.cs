using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changetablepromotionproductchangedate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "PromotionProduct",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "PromotionProduct",
                newName: "EndDate");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "PromotionProduct",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "PromotionProduct",
                newName: "CreatedAt");
        }
    }
}
