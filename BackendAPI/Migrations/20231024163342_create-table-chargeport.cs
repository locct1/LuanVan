using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtablechargeport : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChargerPortId",
                table: "Product",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HeadPhoneTime",
                table: "Product",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "JackPlugId",
                table: "Product",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChargerPort",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChargerPort", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JackPlug",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JackPlug", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_ChargerPortId",
                table: "Product",
                column: "ChargerPortId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_JackPlugId",
                table: "Product",
                column: "JackPlugId");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_ChargerPort_ChargerPortId",
                table: "Product",
                column: "ChargerPortId",
                principalTable: "ChargerPort",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_JackPlug_JackPlugId",
                table: "Product",
                column: "JackPlugId",
                principalTable: "JackPlug",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_ChargerPort_ChargerPortId",
                table: "Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_JackPlug_JackPlugId",
                table: "Product");

            migrationBuilder.DropTable(
                name: "ChargerPort");

            migrationBuilder.DropTable(
                name: "JackPlug");

            migrationBuilder.DropIndex(
                name: "IX_Product_ChargerPortId",
                table: "Product");

            migrationBuilder.DropIndex(
                name: "IX_Product_JackPlugId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "ChargerPortId",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "HeadPhoneTime",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "JackPlugId",
                table: "Product");
        }
    }
}
