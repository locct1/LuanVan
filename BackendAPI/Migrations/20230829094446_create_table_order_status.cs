using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class create_table_order_status : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "Order");

            migrationBuilder.AddColumn<int>(
                name: "OrderStatusId",
                table: "Order",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrderStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatus", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Order_OrderStatusId",
                table: "Order",
                column: "OrderStatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_Order_OrderStatus_OrderStatusId",
                table: "Order",
                column: "OrderStatusId",
                principalTable: "OrderStatus",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Order_OrderStatus_OrderStatusId",
                table: "Order");

            migrationBuilder.DropTable(
                name: "OrderStatus");

            migrationBuilder.DropIndex(
                name: "IX_Order_OrderStatusId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "OrderStatusId",
                table: "Order");

            migrationBuilder.AddColumn<int>(
                name: "StatusId",
                table: "Order",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
