using CositadeZacatlan.Domain.Entities;

namespace CositadeZacatlan.Domain.Interfaces;

public interface IBlockedDateRepository
{
    Task<IEnumerable<BlockedDate>> GetByAccommodationIdAndDateRangeAsync(Guid accommodationId, DateOnly startDate, DateOnly endDate, CancellationToken ct = default);
    Task<IEnumerable<BlockedDate>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate, CancellationToken ct = default);
    Task AddAsync(BlockedDate blockedDate, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
    Task<bool> IsDateBlockedAsync(Guid accommodationId, DateOnly date, CancellationToken ct = default);
}
