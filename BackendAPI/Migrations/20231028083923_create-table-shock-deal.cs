using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtableshockdeal : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ShockDeal",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Disabled = table.Column<bool>(type: "bit", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShockDeal", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ShockDealDetail",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MainProductId = table.Column<int>(type: "int", nullable: true),
                    ShockDealProductId = table.Column<int>(type: "int", nullable: true),
                    ShockDealPrice = table.Column<double>(type: "float", nullable: false),
                    ShockDealId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShockDealDetail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShockDealDetail_Product_MainProductId",
                        column: x => x.MainProductId,
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ShockDealDetail_Product_ShockDealProductId",
                        column: x => x.ShockDealProductId,
                        principalTable: "Product",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ShockDealDetail_ShockDeal_ShockDealId",
                        column: x => x.ShockDealId,
                        principalTable: "ShockDeal",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShockDealDetail_MainProductId",
                table: "ShockDealDetail",
                column: "MainProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ShockDealDetail_ShockDealId",
                table: "ShockDealDetail",
                column: "ShockDealId");

            migrationBuilder.CreateIndex(
                name: "IX_ShockDealDetail_ShockDealProductId",
                table: "ShockDealDetail",
                column: "ShockDealProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShockDealDetail");

            migrationBuilder.DropTable(
                name: "ShockDeal");
        }
    }
}
