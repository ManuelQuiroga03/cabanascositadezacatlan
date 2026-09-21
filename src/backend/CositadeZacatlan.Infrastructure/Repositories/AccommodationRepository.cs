using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Interfaces;
using CositadeZacatlan.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CositadeZacatlan.Infrastructure.Repositories;

public class AccommodationRepository : IAccommodationRepository
{
    private readonly ApplicationDbContext _dbContext;

    public AccommodationRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Accommodation>> GetAllActiveAsync(CancellationToken ct = default)
    {
        return await _dbContext.Accommodations
            .AsNoTracking()
            .Where(a => a.IsActive)
            .ToListAsync(ct);
    }

    public async Task<Accommodation?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        return await _dbContext.Accommodations
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Slug.ToLower() == slug.ToLower() && a.IsActive, ct);
    }

    public async Task<Accommodation?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.Accommodations
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }

    public async Task UpdateAsync(Accommodation accommodation, CancellationToken ct = default)
    {
        _dbContext.Accommodations.Update(accommodation);
        await _dbContext.SaveChangesAsync(ct);
    }
}
