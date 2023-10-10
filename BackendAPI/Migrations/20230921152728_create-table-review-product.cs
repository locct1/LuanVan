using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendAPI.Migrations
{
    public partial class createtablereviewproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReviewProduct",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommentContent = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReviewProduct", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReviewProduct_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ReviewProduct_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "FeedbackReviewProduct",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FeedBackContent = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ReviewProductId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedbackReviewProduct", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeedbackReviewProduct_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FeedbackReviewProduct_ReviewProduct_ReviewProductId",
                        column: x => x.ReviewProductId,
                        principalTable: "ReviewProduct",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "LikeReviewProduct",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReviewProductId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LikeReviewProduct", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LikeReviewProduct_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LikeReviewProduct_ReviewProduct_ReviewProductId",
                        column: x => x.ReviewProductId,
                        principalTable: "ReviewProduct",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackReviewProduct_ReviewProductId",
                table: "FeedbackReviewProduct",
                column: "ReviewProductId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedbackReviewProduct_UserId",
                table: "FeedbackReviewProduct",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LikeReviewProduct_ReviewProductId",
                table: "LikeReviewProduct",
                column: "ReviewProductId");

            migrationBuilder.CreateIndex(
                name: "IX_LikeReviewProduct_UserId",
                table: "LikeReviewProduct",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewProduct_ProductId",
                table: "ReviewProduct",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ReviewProduct_UserId",
                table: "ReviewProduct",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeedbackReviewProduct");

            migrationBuilder.DropTable(
                name: "LikeReviewProduct");

            migrationBuilder.DropTable(
                name: "ReviewProduct");
        }
    }
}
