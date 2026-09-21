using CositadeZacatlan.Application.Configuration;
using CositadeZacatlan.Application.Dtos;
using CositadeZacatlan.Application.Interfaces;
using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Enums;
using CositadeZacatlan.Domain.Exceptions;
using CositadeZacatlan.Domain.Interfaces;
using Microsoft.Extensions.Options;

namespace CositadeZacatlan.Application.Services;

public class AvailabilityService : IAvailabilityService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IBookingRepository _bookingRepository;
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly IBlockedDateRepository _blockedDateRepository;
    private readonly BusinessSettings _settings;

    public AvailabilityService(
        IUnitOfWork unitOfWork,
        IBookingRepository bookingRepository,
        IAccommodationRepository accommodationRepository,
        IBlockedDateRepository blockedDateRepository,
        IOptions<BusinessSettings> settingsOptions)
    {
        _unitOfWork = unitOfWork;
        _bookingRepository = bookingRepository;
        _accommodationRepository = accommodationRepository;
        _blockedDateRepository = blockedDateRepository;
        _settings = settingsOptions.Value;
    }

    public async Task<bool> CheckAvailabilityAsync(Guid accommodationId, DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default)
    {
        for (var d = checkIn; d < checkOut; d = d.AddDays(1))
        {
            if (await _blockedDateRepository.IsDateBlockedAsync(accommodationId, d, ct))
            {
                return false;
            }
        }

        var hasOverlap = await _bookingRepository.HasOverlappingBookingAsync(accommodationId, checkIn, checkOut, ct);
        return !hasOverlap;
    }

    public async Task<HoldBookingResponseDto?> CreateHoldAsync(HoldBookingRequestDto request, CancellationToken ct = default)
    {
        using var tx = await _unitOfWork.BeginTransactionAsync(System.Data.IsolationLevel.RepeatableRead, ct);
        try
        {
            var accommodation = await _accommodationRepository.GetByIdAsync(request.AccommodationId, ct);
            if (accommodation == null || !accommodation.IsActive)
            {
                throw new NotFoundException($"El hospedaje especificado no existe o no está activo.");
            }

            var isAvailable = await CheckAvailabilityAsync(request.AccommodationId, request.CheckInDate, request.CheckOutDate, ct);
            if (!isAvailable)
            {
                throw new AlreadyBookedException($"Las fechas del {request.CheckInDate:dd/MM/yyyy} al {request.CheckOutDate:dd/MM/yyyy} ya se encuentran reservadas o bloqueadas.");
            }

            int nights = request.CheckOutDate.DayNumber - request.CheckInDate.DayNumber;
            if (nights <= 0) nights = 1;

            decimal totalAmount = accommodation.BasePrice * nights;
            int ttlMinutes = _settings.HoldTtlMinutes;
            DateTime expiresAtUtc = DateTime.UtcNow.AddMinutes(ttlMinutes);

            var booking = new Booking
            {
                Id = Guid.NewGuid(),
                AccommodationId = request.AccommodationId,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                CheckInDate = request.CheckInDate,
                CheckOutDate = request.CheckOutDate,
                TotalAmount = totalAmount,
                Status = BookingStatus.PendingHold,
                ExpiresAtUtc = expiresAtUtc,
                CreatedAtUtc = DateTime.UtcNow
            };

            await _bookingRepository.AddAsync(booking, ct);

            if (tx != null)
            {
                await _unitOfWork.CommitTransactionAsync(ct);
            }

            return new HoldBookingResponseDto(
                booking.Id,
                accommodation.Id,
                accommodation.Name,
                booking.CustomerName,
                booking.CustomerPhone,
                booking.CheckInDate,
                booking.CheckOutDate,
                booking.TotalAmount,
                booking.Status,
                booking.ExpiresAtUtc,
                ttlMinutes
            );
        }
        catch
        {
            if (tx != null)
            {
                await _unitOfWork.RollbackTransactionAsync(ct);
            }
            throw;
        }
    }

    public async Task<ConfirmWhatsAppResponseDto?> ConfirmWhatsAppBookingAsync(ConfirmWhatsAppRequestDto request, CancellationToken ct = default)
    {
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId, ct);
        if (booking == null)
        {
            throw new NotFoundException($"No se encontró la reserva con ID '{request.BookingId}'.");
        }

        booking.Status = BookingStatus.Confirmed;
        await _bookingRepository.UpdateAsync(booking, ct);

        string message = Uri.EscapeDataString(
            $"¡Hola! Quisiera confirmar mi reserva en Una Cosita de Zacatlán.\n\n" +
            $"📌 *ID Reserva:* {booking.Id}\n" +
            $"👤 *Nombre:* {booking.CustomerName}\n" +
            $"📅 *Fechas:* {booking.CheckInDate:dd/MM/yyyy} al {booking.CheckOutDate:dd/MM/yyyy}\n" +
            $"💰 *Monto Total:* ${booking.TotalAmount:N2} MXN");

        string phone = _settings.WhatsAppPhoneNumber;
        string whatsappUrl = $"https://wa.me/{phone}?text={message}";

        return new ConfirmWhatsAppResponseDto(
            booking.Id,
            booking.Status,
            whatsappUrl,
            "Reserva confirmada. Redirigiendo a WhatsApp..."
        );
    }

    public async Task<MonthlyAvailabilityDto?> GetMonthlyAvailabilityAsync(Guid accommodationId, int month, int year, CancellationToken ct = default)
    {
        var accommodation = await _accommodationRepository.GetByIdAsync(accommodationId, ct);
        if (accommodation == null) return null;

        var startDate = new DateOnly(year, month, 1);
        var daysInMonth = DateTime.DaysInMonth(year, month);
        var endDate = new DateOnly(year, month, daysInMonth);

        var bookings = await _bookingRepository.GetBookingsInDateRangeAsync(startDate, endDate, ct);
        var blockedDates = (await _blockedDateRepository.GetByAccommodationIdAndDateRangeAsync(accommodationId, startDate, endDate, ct))
            .Select(b => b.Date).ToHashSet();

        var days = new List<DayAvailabilityDto>();

        for (int day = 1; day <= daysInMonth; day++)
        {
            var date = new DateOnly(year, month, day);
            string status = "Available";

            if (blockedDates.Contains(date))
            {
                status = "Blocked";
            }
            else
            {
                var bookingOnDay = bookings.FirstOrDefault(b => b.AccommodationId == accommodationId && b.CheckInDate <= date && b.CheckOutDate > date);
                if (bookingOnDay != null)
                {
                    status = bookingOnDay.Status == BookingStatus.Confirmed ? "Occupied" : "Hold";
                }
            }

            days.Add(new DayAvailabilityDto(date, status, accommodation.BasePrice));
        }

        return new MonthlyAvailabilityDto(accommodation.Id, accommodation.Name, month, year, days);
    }

    public async Task<MatrixAvailabilityDto> GetMatrixAvailabilityAsync(DateOnly startDate, DateOnly endDate, CancellationToken ct = default)
    {
        var accommodations = await _accommodationRepository.GetAllActiveAsync(ct);
        var bookings = await _bookingRepository.GetBookingsInDateRangeAsync(startDate, endDate, ct);
        var blockedDates = await _blockedDateRepository.GetByDateRangeAsync(startDate, endDate, ct);

        var items = new List<MatrixItemDto>();

        foreach (var acc in accommodations)
        {
            var accBookings = bookings.Where(b => b.AccommodationId == acc.Id).ToList();
            var accBlocked = blockedDates.Where(b => b.AccommodationId == acc.Id).Select(b => b.Date).ToHashSet();

            var dailyStatuses = new List<MatrixDayStatusDto>();

            for (var current = startDate; current <= endDate; current = current.AddDays(1))
            {
                string status = "Available";

                if (accBlocked.Contains(current))
                {
                    status = "Blocked";
                }
                else
                {
                    var b = accBookings.FirstOrDefault(bk => bk.CheckInDate <= current && bk.CheckOutDate > current);
                    if (b != null)
                    {
                        status = b.Status == BookingStatus.Confirmed ? "Occupied" : "Hold";
                    }
                }

                dailyStatuses.Add(new MatrixDayStatusDto(current, status));
            }

            items.Add(new MatrixItemDto(acc.Id, acc.Name, acc.Type, acc.Capacity, acc.BasePrice, dailyStatuses));
        }

        return new MatrixAvailabilityDto(startDate, endDate, items);
    }

    public async Task<int> CleanupExpiredHoldsAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var expiredHolds = await _bookingRepository.GetExpiredHoldsAsync(now, ct);
        int count = 0;

        foreach (var hold in expiredHolds)
        {
            hold.Status = BookingStatus.Expired;
            await _bookingRepository.UpdateAsync(hold, ct);
            count++;
        }

        return count;
    }
}
