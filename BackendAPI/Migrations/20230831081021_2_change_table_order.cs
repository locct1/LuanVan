using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class _2_change_table_order : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_Amount",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_BankCode",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_OrderId",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_OrderInfo",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_PayDate",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_SecureHash",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_TransactionNo",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Onl_TransactionStatus",
                table: "Order",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_Amount",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_BankCode",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_OrderId",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_OrderInfo",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_PayDate",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_SecureHash",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_TransactionNo",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "Onl_TransactionStatus",
                table: "Order");
        }
    }
}
