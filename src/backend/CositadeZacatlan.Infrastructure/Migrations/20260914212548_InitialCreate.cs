using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CositadeZacatlan.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accommodations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    BasePrice = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Amenities = table.Column<List<string>>(type: "text[]", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accommodations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlockedDates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AccommodationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlockedDates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BlockedDates_Accommodations_AccommodationId",
                        column: x => x.AccommodationId,
                        principalTable: "Accommodations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AccommodationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CustomerPhone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    CheckInDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CheckOutDate = table.Column<DateOnly>(type: "date", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ExpiresAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Accommodations_AccommodationId",
                        column: x => x.AccommodationId,
                        principalTable: "Accommodations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Accommodations",
                columns: new[] { "Id", "Amenities", "BasePrice", "Capacity", "CreatedAtUtc", "Description", "IsActive", "Name", "Slug", "Type", "UpdatedAtUtc" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-000000000001"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 1850m, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña Vista a la Niebla: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña Vista a la Niebla", "cabana-vista-a-la-niebla", 1, null },
                    { new Guid("11111111-1111-1111-1111-000000000002"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 3200m, 8, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña El Bosque Encantado: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña El Bosque Encantado", "cabana-el-bosque-encantado", 1, null },
                    { new Guid("11111111-1111-1111-1111-000000000003"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 2100m, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña Manzana Dorada: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña Manzana Dorada", "cabana-manzana-dorada", 1, null },
                    { new Guid("11111111-1111-1111-1111-000000000004"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 2500m, 6, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña El Nido del Águila: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña El Nido del Águila", "cabana-el-nido-del-aguila", 1, null },
                    { new Guid("11111111-1111-1111-1111-000000000005"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 1950m, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña Los Pinos Altos: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña Los Pinos Altos", "cabana-los-pinos-altos", 1, null },
                    { new Guid("11111111-1111-1111-1111-000000000006"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 2300m, 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña Rincón del Fuego: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña Rincón del Fuego", "cabana-rincon-del-fuego", 1, null },
                    { new Guid("11111111-1111-1111-1111-000000000007"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 2700m, 6, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña Valle del Sol: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña Valle del Sol", "cabana-valle-del-sol", 1, null },
                    { new Guid("11111111-1111-1111-1111-000000000008"), new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi Starlink", "Terraza Privada", "Asador" }, 2900m, 8, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cabaña La Barranca: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.", true, "Cabaña La Barranca", "cabana-la-barranca", 1, null },
                    { new Guid("22222222-2222-2222-2222-000000000001"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 1350m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Manzanas de Oro: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Manzanas de Oro", "suite-manzanas-de-oro", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000002"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 1470m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Niebla Matutina: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Niebla Matutina", "suite-niebla-matutina", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000003"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 1590m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Sidra Artesanal: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Sidra Artesanal", "suite-sidra-artesanal", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000004"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 1710m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Reloj de Flores: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Reloj de Flores", "suite-reloj-de-flores", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000005"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 1830m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Barranca de los Jilgueros: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Barranca de los Jilgueros", "suite-barranca-de-los-jilgueros", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000006"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 1950m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Los Cedros: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Los Cedros", "suite-los-cedros", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000007"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 2070m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Sol de Montaña: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Sol de Montaña", "suite-sol-de-montana", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000008"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 2190m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Luna de Pino: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Luna de Pino", "suite-luna-de-pino", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000009"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 2310m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Piedra Volcánica: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Piedra Volcánica", "suite-piedra-volcanica", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000010"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 2430m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite El Mirador: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite El Mirador", "suite-el-mirador", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000011"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 2550m, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Arcilla & Leña: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Arcilla & Leña", "suite-arcilla-y-lena", 2, null },
                    { new Guid("22222222-2222-2222-2222-000000000012"), new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" }, 2670m, 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Suite Presidencial Zacatlán: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.", true, "Suite Presidencial Zacatlán", "suite-presidencial-zacatlan", 2, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accommodations_Slug",
                table: "Accommodations",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BlockedDates_AccommodationId",
                table: "BlockedDates",
                column: "AccommodationId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_AccommodationId",
                table: "Bookings",
                column: "AccommodationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlockedDates");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Accommodations");
        }
    }
}
