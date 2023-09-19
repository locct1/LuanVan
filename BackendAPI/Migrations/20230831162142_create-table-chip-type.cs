using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtablechiptype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChipType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChipType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OperatingSystemType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OperatingSystemType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ram",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ram", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rom",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rom", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ScreenTechnology",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScreenTechnology", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Chip",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChipTypeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chip", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chip_ChipType_ChipTypeId",
                        column: x => x.ChipTypeId,
                        principalTable: "ChipType",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OperatingSystem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OperatingSystemTypeId = table.Column<int>(type: "int", nullable: true)
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
                name: "IX_Chip_ChipTypeId",
                table: "Chip",
                column: "ChipTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OperatingSystem_OperatingSystemTypeId",
                table: "OperatingSystem",
                column: "OperatingSystemTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chip");

            migrationBuilder.DropTable(
                name: "OperatingSystem");

            migrationBuilder.DropTable(
                name: "Ram");

            migrationBuilder.DropTable(
                name: "Rom");

            migrationBuilder.DropTable(
                name: "ScreenTechnology");

            migrationBuilder.DropTable(
                name: "ChipType");

            migrationBuilder.DropTable(
                name: "OperatingSystemType");
        }
    }
}
