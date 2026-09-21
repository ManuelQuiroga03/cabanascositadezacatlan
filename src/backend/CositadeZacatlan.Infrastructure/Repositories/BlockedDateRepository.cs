using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Interfaces;
using CositadeZacatlan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CositadeZacatlan.Infrastructure.Repositories;

public class BlockedDateRepository : IBlockedDateRepository
{
    private readonly ApplicationDbContext _dbContext;

    public BlockedDateRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<BlockedDate>> GetByAccommodationIdAndDateRangeAsync(Guid accommodationId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default)
    {
        return await _dbContext.BlockedDates
            .AsNoTracking()
            .Where(b => b.AccommodationId == accommodationId && b.Date >= startDate && b.Date <= endDate)
            .ToListAsync(ct);
    }

    public async Task<IEnumerable<BlockedDate>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate, CancellationToken ct = default)
    {
        return await _dbContext.BlockedDates
            .AsNoTracking()
            .Where(b => b.Date >= startDate && b.Date <= endDate)
            .ToListAsync(ct);
    }

    public async Task AddAsync(BlockedDate blockedDate, CancellationToken ct = default)
    {
        await _dbContext.BlockedDates.AddAsync(blockedDate, ct);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var existing = await _dbContext.BlockedDates.FindAsync(new object[] { id }, ct);
        if (existing != null)
        {
            _dbContext.BlockedDates.Remove(existing);
            await _dbContext.SaveChangesAsync(ct);
        }
    }

    public async Task<bool> IsDateBlockedAsync(Guid accommodationId, DateOnly date, CancellationToken ct = default)
    {
        return await _dbContext.BlockedDates
            .AnyAsync(b => b.AccommodationId == accommodationId && b.Date == date, ct);
    }
}
