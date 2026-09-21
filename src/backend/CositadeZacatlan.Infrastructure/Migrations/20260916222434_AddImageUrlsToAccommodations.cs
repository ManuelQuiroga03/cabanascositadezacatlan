using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CositadeZacatlan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlsToAccommodations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "ImageUrls",
                table: "Accommodations",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000001"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000002"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000003"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000004"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000005"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000006"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000007"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000008"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000001"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000002"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000003"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000004"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000005"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000006"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000007"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000008"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000009"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000010"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000011"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000012"),
                columns: new[] { "Amenities", "ImageUrls" },
                values: new object[] { new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, new List<string>() });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrls",
                table: "Accommodations");

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000001"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000002"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000003"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000004"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000005"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000006"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000007"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-000000000008"),
                column: "Amenities",
                value: new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000001"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000002"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000003"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000004"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000005"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000006"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000007"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000008"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000009"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000010"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000011"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });

            migrationBuilder.UpdateData(
                table: "Accommodations",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-000000000012"),
                column: "Amenities",
                value: new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" });
        }
    }
}
