using CositadeZacatlan.Application.Dtos;

namespace CositadeZacatlan.Application.Interfaces;

public interface IAvailabilityService
{
    Task<bool> CheckAvailabilityAsync(Guid accommodationId, DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default);
    Task<HoldBookingResponseDto?> CreateHoldAsync(HoldBookingRequestDto request, CancellationToken ct = default);
    Task<ConfirmWhatsAppResponseDto?> ConfirmWhatsAppBookingAsync(ConfirmWhatsAppRequestDto request, CancellationToken ct = default);
    Task<MonthlyAvailabilityDto?> GetMonthlyAvailabilityAsync(Guid accommodationId, int month, int year, CancellationToken ct = default);
    Task<MatrixAvailabilityDto> GetMatrixAvailabilityAsync(DateOnly startDate, DateOnly endDate, CancellationToken ct = default);
    Task<int> CleanupExpiredHoldsAsync(CancellationToken ct = default);
}
