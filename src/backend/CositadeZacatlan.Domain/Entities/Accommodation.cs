using CositadeZacatlan.Domain.Enums;

namespace CositadeZacatlan.Domain.Entities;

public class Accommodation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public AccommodationType Type { get; set; }
    public int Capacity { get; set; }
    public decimal BasePrice { get; set; }
    public List<string> Amenities { get; set; } = new();
    public List<string> ImageUrls { get; set; } = new();
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    // Navigation properties
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<BlockedDate> BlockedDates { get; set; } = new List<BlockedDate>();
}
