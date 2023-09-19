using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class changenametable_operating_system_product : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OperatingSystem");

            migrationBuilder.CreateTable(
                name: "OperatingSystemProduct",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OperatingSystemTypeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperatingSystemProduct", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OperatingSystemProduct_OperatingSystemType_OperatingSystemTypeId",
                        column: x => x.OperatingSystemTypeId,
                        principalTable: "OperatingSystemType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_OperatingSystemProduct_OperatingSystemTypeId",
                table: "OperatingSystemProduct",
                column: "OperatingSystemTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OperatingSystemProduct");

            migrationBuilder.CreateTable(
                name: "OperatingSystem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OperatingSystemTypeId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperatingSystem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OperatingSystem_OperatingSystemType_OperatingSystemTypeId",
                        column: x => x.OperatingSystemTypeId,
                        principalTable: "OperatingSystemType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_OperatingSystem_OperatingSystemTypeId",
                table: "OperatingSystem",
                column: "OperatingSystemTypeId");
        }
    }
}
