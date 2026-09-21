using CositadeZacatlan.Domain.Entities;

namespace CositadeZacatlan.Domain.Interfaces;

public interface IAccommodationRepository
{
    Task<IEnumerable<Accommodation>> GetAllActiveAsync(CancellationToken ct = default);
    Task<Accommodation?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<Accommodation?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task UpdateAsync(Accommodation accommodation, CancellationToken ct = default);
}
