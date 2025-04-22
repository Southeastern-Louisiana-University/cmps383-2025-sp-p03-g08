using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTicketAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AspNetUsers_UserId",
                table: "Tickets");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Tickets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "PurchasedBy",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TicketType",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AspNetUsers_UserId",
                table: "Tickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AspNetUsers_UserId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "PurchasedBy",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "TicketType",
                table: "Tickets");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AspNetUsers_UserId",
                table: "Tickets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
