using CositadeZacatlan.Application.Dtos;

namespace CositadeZacatlan.Application.Interfaces;

public interface IAdminService
{
    Task<BlockedDateDto?> CreateBlockAsync(CreateManualBlockDto request, CancellationToken ct = default);
    Task<bool> DeleteBlockAsync(Guid blockId, CancellationToken ct = default);
    Task<BookingDetailDto?> ConfirmBookingAsync(Guid bookingId, CancellationToken ct = default);
    Task<DashboardStatsDto> GetDashboardStatsAsync(CancellationToken ct = default);
    Task<IEnumerable<BookingDetailDto>> GetPendingHoldsAsync(CancellationToken ct = default);
    Task<AccommodationDto?> UpdateAccommodationAsync(Guid id, UpdateAccommodationDto request, CancellationToken ct = default);
}
