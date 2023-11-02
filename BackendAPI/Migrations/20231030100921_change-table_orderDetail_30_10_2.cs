using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changetable_orderDetail_30_10_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isShockDeal",
                table: "OrderDetail",
                newName: "IsShockDeal");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsShockDeal",
                table: "OrderDetail",
                newName: "isShockDeal");
        }
    }
}
