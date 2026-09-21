namespace CositadeZacatlan.Domain.Entities;

public class BlockedDate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AccommodationId { get; set; }
    public Accommodation? Accommodation { get; set; }
    public DateOnly Date { get; set; }
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
