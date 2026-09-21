using CositadeZacatlan.Domain.Entities;

namespace CositadeZacatlan.Domain.Interfaces;

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetByAccommodationIdAsync(Guid accommodationId, CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetExpiredHoldsAsync(DateTime nowUtc, CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetPendingHoldsAsync(CancellationToken ct = default);
    Task<IEnumerable<Booking>> GetBookingsInDateRangeAsync(DateOnly startDate, DateOnly endDate, CancellationToken ct = default);
    Task<int> GetOccupiedTodayCountAsync(DateOnly today, CancellationToken ct = default);
    Task AddAsync(Booking booking, CancellationToken ct = default);
    Task UpdateAsync(Booking booking, CancellationToken ct = default);
    Task<bool> HasOverlappingBookingAsync(Guid accommodationId, DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default);
}
