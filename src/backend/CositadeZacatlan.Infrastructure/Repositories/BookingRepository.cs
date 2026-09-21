using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Enums;
using CositadeZacatlan.Domain.Interfaces;
using CositadeZacatlan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CositadeZacatlan.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly ApplicationDbContext _dbContext;

    public BookingRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Booking?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.Bookings
            .Include(b => b.Accommodation)
            .FirstOrDefaultAsync(b => b.Id == id, ct);
    }

    public async Task<IEnumerable<Booking>> GetByAccommodationIdAsync(Guid accommodationId, CancellationToken ct = default)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .Where(b => b.AccommodationId == accommodationId)
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<Booking>> GetExpiredHoldsAsync(DateTime nowUtc, CancellationToken ct = default)
    {
        return await _dbContext.Bookings
            .Where(b => b.Status == BookingStatus.PendingHold && b.ExpiresAtUtc <= nowUtc)
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<Booking>> GetPendingHoldsAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        return await _dbContext.Bookings
            .Include(b => b.Accommodation)
            .AsNoTracking()
            .Where(b => b.Status == BookingStatus.PendingHold && b.ExpiresAtUtc > now)
            .OrderByDescending(b => b.CreatedAtUtc)
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<Booking>> GetBookingsInDateRangeAsync(DateOnly startDate, DateOnly endDate, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        return await _dbContext.Bookings
            .AsNoTracking()
            .Where(b => (b.Status == BookingStatus.Confirmed || (b.Status == BookingStatus.PendingHold && b.ExpiresAtUtc > now)) &&
                        b.CheckInDate < endDate && b.CheckOutDate > startDate)
            .ToListAsync(ct);
    }

    public async Task<int> GetOccupiedTodayCountAsync(DateOnly today, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        return await _dbContext.Bookings
            .CountAsync(b => (b.Status == BookingStatus.Confirmed || (b.Status == BookingStatus.PendingHold && b.ExpiresAtUtc > now)) &&
                             b.CheckInDate <= today && b.CheckOutDate > today, ct);
    }

    public async Task AddAsync(Booking booking, CancellationToken ct = default)
    {
        await _dbContext.Bookings.AddAsync(booking, ct);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Booking booking, CancellationToken ct = default)
    {
        _dbContext.Bookings.Update(booking);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task<bool> HasOverlappingBookingAsync(Guid accommodationId, DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;

        return await _dbContext.Bookings
            .AnyAsync(b => b.AccommodationId == accommodationId &&
                           (b.Status == BookingStatus.Confirmed || (b.Status == BookingStatus.PendingHold && b.ExpiresAtUtc > now)) &&
                           checkIn < b.CheckOutDate &&
                           checkOut > b.CheckInDate, ct);
    }
}
