using CositadeZacatlan.Application.Configuration;
using CositadeZacatlan.Application.Dtos;
using CositadeZacatlan.Application.Interfaces;
using CositadeZacatlan.Application.Services;
using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Enums;
using CositadeZacatlan.Domain.Exceptions;
using CositadeZacatlan.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace CositadeZacatlan.UnitTests;

public class AvailabilityServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IBookingRepository> _bookingRepoMock;
    private readonly Mock<IAccommodationRepository> _accommodationRepoMock;
    private readonly Mock<IBlockedDateRepository> _blockedDateRepoMock;
    private readonly IOptions<BusinessSettings> _settingsOptions;
    private readonly AvailabilityService _service;

    public AvailabilityServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _bookingRepoMock = new Mock<IBookingRepository>();
        _accommodationRepoMock = new Mock<IAccommodationRepository>();
        _blockedDateRepoMock = new Mock<IBlockedDateRepository>();

        _settingsOptions = Options.Create(new BusinessSettings
        {
            HoldTtlMinutes = 15,
            WhatsAppPhoneNumber = "527971234567"
        });

        _service = new AvailabilityService(
            _unitOfWorkMock.Object,
            _bookingRepoMock.Object,
            _accommodationRepoMock.Object,
            _blockedDateRepoMock.Object,
            _settingsOptions
        );
    }

    [Fact]
    public async Task CheckAvailabilityAsync_ReturnsFalse_WhenDateIsBlocked()
    {
        // Arrange
        var accId = Guid.NewGuid();
        var checkIn = new DateOnly(2026, 10, 1);
        var checkOut = new DateOnly(2026, 10, 3);

        _blockedDateRepoMock
            .Setup(r => r.IsDateBlockedAsync(accId, checkIn, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _service.CheckAvailabilityAsync(accId, checkIn, checkOut);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailabilityAsync_ReturnsFalse_WhenOverlappingBookingExists()
    {
        // Arrange
        var accId = Guid.NewGuid();
        var checkIn = new DateOnly(2026, 10, 1);
        var checkOut = new DateOnly(2026, 10, 3);

        _blockedDateRepoMock
            .Setup(r => r.IsDateBlockedAsync(accId, It.IsAny<DateOnly>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _bookingRepoMock
            .Setup(r => r.HasOverlappingBookingAsync(accId, checkIn, checkOut, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act
        var result = await _service.CheckAvailabilityAsync(accId, checkIn, checkOut);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailabilityAsync_ReturnsTrue_WhenDatesAreAvailable()
    {
        // Arrange
        var accId = Guid.NewGuid();
        var checkIn = new DateOnly(2026, 10, 1);
        var checkOut = new DateOnly(2026, 10, 3);

        _blockedDateRepoMock
            .Setup(r => r.IsDateBlockedAsync(accId, It.IsAny<DateOnly>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _bookingRepoMock
            .Setup(r => r.HasOverlappingBookingAsync(accId, checkIn, checkOut, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var result = await _service.CheckAvailabilityAsync(accId, checkIn, checkOut);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task CreateHoldAsync_ThrowsNotFoundException_WhenAccommodationDoesNotExist()
    {
        // Arrange
        var request = new HoldBookingRequestDto(
            Guid.NewGuid(),
            "Juan Pérez",
            "5512345678",
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 3)
        );

        _accommodationRepoMock
            .Setup(r => r.GetByIdAsync(request.AccommodationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Accommodation?)null);

        // Act
        var act = async () => await _service.CreateHoldAsync(request);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task CreateHoldAsync_CreatesBookingWithCorrectTotalAmountAndExpiration_WhenAvailable()
    {
        // Arrange
        var accId = Guid.NewGuid();
        var accommodation = new Accommodation
        {
            Id = accId,
            Name = "Cabaña La Niebla",
            BasePrice = 1500m,
            IsActive = true
        };

        var request = new HoldBookingRequestDto(
            accId,
            "María López",
            "7979876543",
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 3) // 2 noches
        );

        _accommodationRepoMock
            .Setup(r => r.GetByIdAsync(accId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(accommodation);

        _blockedDateRepoMock
            .Setup(r => r.IsDateBlockedAsync(accId, It.IsAny<DateOnly>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _bookingRepoMock
            .Setup(r => r.HasOverlappingBookingAsync(accId, request.CheckInDate, request.CheckOutDate, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var response = await _service.CreateHoldAsync(request);

        // Assert
        response.Should().NotBeNull();
        response!.AccommodationName.Should().Be("Cabaña La Niebla");
        response.TotalAmount.Should().Be(3000m); // 1500 * 2 noches
        response.Status.Should().Be(BookingStatus.PendingHold);
        response.HoldTtlMinutes.Should().Be(15);
        _bookingRepoMock.Verify(r => r.AddAsync(It.IsAny<Booking>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CleanupExpiredHoldsAsync_UpdatesStatusToExpired_ForExpiredHolds()
    {
        // Arrange
        var expiredHolds = new List<Booking>
        {
            new Booking { Id = Guid.NewGuid(), Status = BookingStatus.PendingHold },
            new Booking { Id = Guid.NewGuid(), Status = BookingStatus.PendingHold }
        };

        _bookingRepoMock
            .Setup(r => r.GetExpiredHoldsAsync(It.IsAny<DateTime>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expiredHolds);

        // Act
        var count = await _service.CleanupExpiredHoldsAsync();

        // Assert
        count.Should().Be(2);
        expiredHolds.All(b => b.Status == BookingStatus.Expired).Should().BeTrue();
        _bookingRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Booking>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
    }
}
