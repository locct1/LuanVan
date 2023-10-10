using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtablereviewproductphoto : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReviewProductPhoto",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReviewProductId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewProductPhoto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReviewProductPhoto_ReviewProduct_ReviewProductId",
                        column: x => x.ReviewProductId,
                        principalTable: "ReviewProduct",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReviewProductPhoto_ReviewProductId",
                table: "ReviewProductPhoto",
                column: "ReviewProductId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReviewProductPhoto");
        }
    }
}
