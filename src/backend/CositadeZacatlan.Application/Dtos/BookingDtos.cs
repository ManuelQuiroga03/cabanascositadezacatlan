using CositadeZacatlan.Domain.Enums;

namespace CositadeZacatlan.Application.Dtos;

public record AccommodationDto(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    AccommodationType Type,
    int Capacity,
    decimal BasePrice,
    List<string> Amenities,
    List<string> ImageUrls,
    bool IsActive
);

public record UpdateAccommodationDto(
    string Name,
    string Description,
    AccommodationType Type,
    int Capacity,
    decimal BasePrice,
    List<string> Amenities,
    List<string> ImageUrls,
    bool IsActive
);

public record HoldBookingRequestDto(
    Guid AccommodationId,
    string CustomerName,
    string CustomerPhone,
    DateOnly CheckInDate,
    DateOnly CheckOutDate
);

public record HoldBookingResponseDto(
    Guid BookingId,
    Guid AccommodationId,
    string AccommodationName,
    string CustomerName,
    string CustomerPhone,
    DateOnly CheckInDate,
    DateOnly CheckOutDate,
    decimal TotalAmount,
    BookingStatus Status,
    DateTime ExpiresAtUtc,
    int HoldTtlMinutes
);

public record ConfirmWhatsAppRequestDto(
    Guid BookingId
);

public record ConfirmWhatsAppResponseDto(
    Guid BookingId,
    BookingStatus Status,
    string WhatsAppRedirectUrl,
    string Message
);

// --- Availability & Matrix DTOs ---

public record DayAvailabilityDto(
    DateOnly Date,
    string Status, // "Available", "Occupied", "Hold", "Blocked"
    decimal Price
);

public record MonthlyAvailabilityDto(
    Guid AccommodationId,
    string AccommodationName,
    int Month,
    int Year,
    List<DayAvailabilityDto> Days
);

public record MatrixDayStatusDto(
    DateOnly Date,
    string Status // "Available", "Occupied", "Hold", "Blocked"
);

public record MatrixItemDto(
    Guid AccommodationId,
    string AccommodationName,
    AccommodationType Type,
    int Capacity,
    decimal BasePrice,
    List<MatrixDayStatusDto> DailyStatuses
);

public record MatrixAvailabilityDto(
    DateOnly StartDate,
    DateOnly EndDate,
    List<MatrixItemDto> Items
);

// --- Admin Backoffice DTOs ---

public record CreateManualBlockDto(
    Guid AccommodationId,
    DateOnly Date,
    string Reason
);

public record BlockedDateDto(
    Guid Id,
    Guid AccommodationId,
    DateOnly Date,
    string Reason
);

public record DashboardStatsDto(
    int PendingHoldsCount,
    int ConfirmedBookingsCount,
    int TotalAccommodations,
    int OccupiedTodayCount,
    decimal TotalRevenue
);

public record BookingDetailDto(
    Guid Id,
    Guid AccommodationId,
    string AccommodationName,
    string CustomerName,
    string CustomerPhone,
    DateOnly CheckInDate,
    DateOnly CheckOutDate,
    decimal TotalAmount,
    BookingStatus Status,
    DateTime ExpiresAtUtc,
    DateTime CreatedAtUtc
);

// --- Review DTOs ---

public record ReviewDto(
    Guid Id,
    Guid AccommodationId,
    string AuthorName,
    int Rating,
    string Comment,
    DateTime CreatedAt
);

public record ImageUploadResponseDto(
    string ImageUrl
);
