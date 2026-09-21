using CositadeZacatlan.Application.Dtos;
using CositadeZacatlan.Application.Services;
using CositadeZacatlan.Domain.Entities;
using CositadeZacatlan.Domain.Enums;
using CositadeZacatlan.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace CositadeZacatlan.UnitTests;

public class AdminServiceTests
{
    private readonly Mock<IBlockedDateRepository> _blockedDateRepoMock;
    private readonly Mock<IBookingRepository> _bookingRepoMock;
    private readonly Mock<IAccommodationRepository> _accommodationRepoMock;
    private readonly AdminService _adminService;

    public AdminServiceTests()
    {
        _blockedDateRepoMock = new Mock<IBlockedDateRepository>();
        _bookingRepoMock = new Mock<IBookingRepository>();
        _accommodationRepoMock = new Mock<IAccommodationRepository>();

        _adminService = new AdminService(
            _blockedDateRepoMock.Object,
            _bookingRepoMock.Object,
            _accommodationRepoMock.Object
        );
    }

    [Fact]
    public async Task CreateBlockAsync_ReturnsNull_WhenAccommodationDoesNotExist()
    {
        // Arrange
        var request = new CreateManualBlockDto(Guid.NewGuid(), new DateOnly(2026, 10, 5), "Mantenimiento");
        _accommodationRepoMock
            .Setup(r => r.GetByIdAsync(request.AccommodationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Accommodation?)null);

        // Act
        var result = await _adminService.CreateBlockAsync(request);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateBlockAsync_CreatesBlockedDateWithDefaultReason_WhenReasonIsEmpty()
    {
        // Arrange
        var accId = Guid.NewGuid();
        var accommodation = new Accommodation { Id = accId, Name = "Cabaña 1" };
        var request = new CreateManualBlockDto(accId, new DateOnly(2026, 10, 5), "");

        _accommodationRepoMock
            .Setup(r => r.GetByIdAsync(accId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(accommodation);

        // Act
        var result = await _adminService.CreateBlockAsync(request);

        // Assert
        result.Should().NotBeNull();
        result!.Reason.Should().Be("Bloqueo por mantenimiento o teléfono");
        _blockedDateRepoMock.Verify(r => r.AddAsync(It.IsAny<BlockedDate>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ConfirmBookingAsync_UpdatesStatusToConfirmed()
    {
        // Arrange
        var bookingId = Guid.NewGuid();
        var booking = new Booking
        {
            Id = bookingId,
            CustomerName = "Pedro Picapiedra",
            Status = BookingStatus.PendingHold,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(15)
        };

        _bookingRepoMock
            .Setup(r => r.GetByIdAsync(bookingId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(booking);

        // Act
        var result = await _adminService.ConfirmBookingAsync(bookingId);

        // Assert
        result.Should().NotBeNull();
        result!.Status.Should().Be(BookingStatus.Confirmed);
        _bookingRepoMock.Verify(r => r.UpdateAsync(It.Is<Booking>(b => b.Status == BookingStatus.Confirmed), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAccommodationAsync_UpdatesPropertiesCorrectly()
    {
        // Arrange
        var accId = Guid.NewGuid();
        var accommodation = new Accommodation
        {
            Id = accId,
            Name = "Cabaña Vieja",
            Description = "Vieja descripción",
            BasePrice = 1000m,
            IsActive = true
        };

        var request = new UpdateAccommodationDto(
            "Cabaña Renovada",
            "Nueva descripción detallada",
            AccommodationType.Cabin,
            4,
            1800m,
            new List<string> { "Chimenea", "Wi-Fi" },
            new List<string> { "https://supabase.co/foto1.jpg" },
            true
        );

        _accommodationRepoMock
            .Setup(r => r.GetByIdAsync(accId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(accommodation);

        // Act
        var result = await _adminService.UpdateAccommodationAsync(accId, request);

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Cabaña Renovada");
        result.BasePrice.Should().Be(1800m);
        result.Amenities.Should().Contain("Chimenea");
        _accommodationRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Accommodation>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
