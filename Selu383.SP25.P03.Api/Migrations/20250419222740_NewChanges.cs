using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class NewChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tickets_ShowingId",
                table: "Tickets");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ShowingId_SeatId",
                table: "Tickets",
                columns: new[] { "ShowingId", "SeatId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tickets_ShowingId_SeatId",
                table: "Tickets");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ShowingId",
                table: "Tickets",
                column: "ShowingId");
        }
    }
}
