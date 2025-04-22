using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTicketId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the existing primary key constraint on Tickets (if any)
            migrationBuilder.DropPrimaryKey(
                name: "PK_Tickets",
                table: "Tickets");

            // Drop the old Id column (of type int)
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Tickets");

            // Add the new Id column as a Guid with a default value (NEWID() generates a new Guid)
            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "Tickets",
                type: "uniqueidentifier",
                nullable: false,
                defaultValueSql: "NEWID()");

            // Re-add the primary key constraint on the new Id column
            migrationBuilder.AddPrimaryKey(
                name: "PK_Tickets",
                table: "Tickets",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse the changes in Down: drop the new primary key, drop the Guid column, and re-add the int column

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tickets",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Tickets");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tickets",
                table: "Tickets",
                column: "Id");
        }
    }
}
