using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CositadeZacatlan.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Accommodation> Accommodations => Set<Accommodation>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BlockedDate> BlockedDates => Set<BlockedDate>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Accommodation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(150);
            entity.Property(e => e.BasePrice).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.CustomerPhone).IsRequired().HasMaxLength(30);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);

            entity.HasOne(e => e.Accommodation)
                  .WithMany(a => a.Bookings)
                  .HasForeignKey(e => e.AccommodationId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<BlockedDate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Accommodation)
                  .WithMany(a => a.BlockedDates)
                  .HasForeignKey(e => e.AccommodationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        SeedFullAccommodationsCatalog(modelBuilder);
    }

    private static void SeedFullAccommodationsCatalog(ModelBuilder modelBuilder)
    {
        var accommodations = new List<Accommodation>();

        // 8 Cabins
        string[] cabinNames = new[]
        {
            "Cabaña Vista a la Niebla",
            "Cabaña El Bosque Encantado",
            "Cabaña Manzana Dorada",
            "Cabaña El Nido del Águila",
            "Cabaña Los Pinos Altos",
            "Cabaña Rincón del Fuego",
            "Cabaña Valle del Sol",
            "Cabaña La Barranca"
        };

        decimal[] cabinPrices = new[] { 1850m, 3200m, 2100m, 2500m, 1950m, 2300m, 2700m, 2900m };
        int[] cabinCapacities = new[] { 4, 8, 4, 6, 4, 5, 6, 8 };

        for (int i = 0; i < 8; i++)
        {
            accommodations.Add(new Accommodation
            {
                Id = Guid.Parse($"11111111-1111-1111-1111-{i + 1:D12}"),
                Name = cabinNames[i],
                Slug = cabinNames[i].ToLower().Replace(" ", "-").Replace("á", "a").Replace("é", "e").Replace("í", "i").Replace("ó", "o").Replace("ú", "u").Replace("ñ", "n"),
                Description = $"{cabinNames[i]}: Cabaña de montaña equipada con chimenea a leña, terraza privada y vistas espectaculares a la sierra de Zacatlán.",
                Type = AccommodationType.Cabin,
                Capacity = cabinCapacities[i],
                BasePrice = cabinPrices[i],
                Amenities = new List<string> { "Chimenea", "Jacuzzi", "Wi-Fi", "Terraza Privada", "Asador" },
                IsActive = true,
                CreatedAtUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        }

        // 12 Hotel Boutique Rooms / Suites
        string[] suiteNames = new[]
        {
            "Suite Manzanas de Oro",
            "Suite Niebla Matutina",
            "Suite Sidra Artesanal",
            "Suite Reloj de Flores",
            "Suite Barranca de los Jilgueros",
            "Suite Los Cedros",
            "Suite Sol de Montaña",
            "Suite Luna de Pino",
            "Suite Piedra Volcánica",
            "Suite El Mirador",
            "Suite Arcilla & Leña",
            "Suite Presidencial Zacatlán"
        };

        for (int i = 0; i < 12; i++)
        {
            accommodations.Add(new Accommodation
            {
                Id = Guid.Parse($"22222222-2222-2222-2222-{i + 1:D12}"),
                Name = suiteNames[i],
                Slug = suiteNames[i].ToLower().Replace(" ", "-").Replace("á", "a").Replace("é", "e").Replace("í", "i").Replace("ó", "o").Replace("ú", "u").Replace("ñ", "n").Replace("&", "y"),
                Description = $"{suiteNames[i]}: Suite de lujo en nuestro Hotel Boutique con acabados artesanales y cama King Size.",
                Type = AccommodationType.HotelRoom,
                Capacity = i == 11 ? 4 : 2,
                BasePrice = 1350m + (i * 120m),
                Amenities = new List<string> { "Cama King Size", "Calefacción Rústica", "Cata de Sidra de Bienvenida", "Room Service" },
                IsActive = true,
                CreatedAtUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        }

        modelBuilder.Entity<Accommodation>().HasData(accommodations);
    }
}
