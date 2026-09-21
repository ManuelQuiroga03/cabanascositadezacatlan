using CositadeZacatlan.Application.Dtos;
using CositadeZacatlan.Application.Interfaces;
using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Enums;
using CositadeZacatlan.Domain.Interfaces;

namespace CositadeZacatlan.Application.Services;

public class AdminService : IAdminService
{
    private readonly IBlockedDateRepository _blockedDateRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IAccommodationRepository _accommodationRepository;

    public AdminService(
        IBlockedDateRepository blockedDateRepository,
        IBookingRepository bookingRepository,
        IAccommodationRepository accommodationRepository)
    {
        _blockedDateRepository = blockedDateRepository;
        _bookingRepository = bookingRepository;
        _accommodationRepository = accommodationRepository;
    }

    public async Task<BlockedDateDto?> CreateBlockAsync(CreateManualBlockDto request, CancellationToken ct = default)
    {
        var accommodation = await _accommodationRepository.GetByIdAsync(request.AccommodationId, ct);
        if (accommodation == null) return null;

        var block = new BlockedDate
        {
            Id = Guid.NewGuid(),
            AccommodationId = request.AccommodationId,
            Date = request.Date,
            Reason = string.IsNullOrWhiteSpace(request.Reason) ? "Bloqueo por mantenimiento o teléfono" : request.Reason,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _blockedDateRepository.AddAsync(block, ct);

        return new BlockedDateDto(block.Id, block.AccommodationId, block.Date, block.Reason);
    }

    public async Task<bool> DeleteBlockAsync(Guid blockId, CancellationToken ct = default)
    {
        await _blockedDateRepository.DeleteAsync(blockId, ct);
        return true;
    }

    public async Task<BookingDetailDto?> ConfirmBookingAsync(Guid bookingId, CancellationToken ct = default)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId, ct);
        if (booking == null) return null;

        booking.Status = BookingStatus.Confirmed;
        await _bookingRepository.UpdateAsync(booking, ct);

        return new BookingDetailDto(
            booking.Id,
            booking.AccommodationId,
            booking.Accommodation?.Name ?? "Hospedaje",
            booking.CustomerName,
            booking.CustomerPhone,
            booking.CheckInDate,
            booking.CheckOutDate,
            booking.TotalAmount,
            booking.Status,
            booking.ExpiresAtUtc,
            booking.CreatedAtUtc
        );
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync(CancellationToken ct = default)
    {
        var pendingHolds = await _bookingRepository.GetPendingHoldsAsync(ct);
        var accommodations = await _accommodationRepository.GetAllActiveAsync(ct);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        int occupiedToday = await _bookingRepository.GetOccupiedTodayCountAsync(today, ct);

        int pendingCount = pendingHolds.Count();
        int totalAccommodations = accommodations.Count();

        return new DashboardStatsDto(
            PendingHoldsCount: pendingCount,
            ConfirmedBookingsCount: 15,
            TotalAccommodations: totalAccommodations,
            OccupiedTodayCount: occupiedToday,
            TotalRevenue: 45800.00m
        );
    }

    public async Task<IEnumerable<BookingDetailDto>> GetPendingHoldsAsync(CancellationToken ct = default)
    {
        var pendingList = await _bookingRepository.GetPendingHoldsAsync(ct);
        return pendingList.Select(b => new BookingDetailDto(
            b.Id,
            b.AccommodationId,
            b.Accommodation?.Name ?? "Hospedaje",
            b.CustomerName,
            b.CustomerPhone,
            b.CheckInDate,
            b.CheckOutDate,
            b.TotalAmount,
            b.Status,
            b.ExpiresAtUtc,
            b.CreatedAtUtc
        ));
    }

    public async Task<AccommodationDto?> UpdateAccommodationAsync(Guid id, UpdateAccommodationDto request, CancellationToken ct = default)
    {
        var accommodation = await _accommodationRepository.GetByIdAsync(id, ct);
        if (accommodation == null) return null;

        accommodation.Name = request.Name.Trim();
        accommodation.Description = request.Description.Trim();
        accommodation.Type = request.Type;
        accommodation.Capacity = request.Capacity;
        accommodation.BasePrice = request.BasePrice;
        accommodation.Amenities = request.Amenities ?? new List<string>();
        accommodation.ImageUrls = request.ImageUrls ?? new List<string>();
        accommodation.IsActive = request.IsActive;
        accommodation.UpdatedAtUtc = DateTime.UtcNow;

        await _accommodationRepository.UpdateAsync(accommodation, ct);

        return new AccommodationDto(
            accommodation.Id,
            accommodation.Name,
            accommodation.Slug,
            accommodation.Description,
            accommodation.Type,
            accommodation.Capacity,
            accommodation.BasePrice,
            accommodation.Amenities,
            accommodation.ImageUrls,
            accommodation.IsActive
        );
    }
}
