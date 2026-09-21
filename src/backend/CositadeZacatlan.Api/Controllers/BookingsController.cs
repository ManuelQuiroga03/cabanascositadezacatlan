using CositadeZacatlan.Application.Dtos;
using CositadeZacatlan.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CositadeZacatlan.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class BookingsController : ControllerBase
{
    private readonly IAvailabilityService _availabilityService;
    private readonly IValidator<HoldBookingRequestDto> _holdValidator;

    public BookingsController(
        IAvailabilityService availabilityService,
        IValidator<HoldBookingRequestDto> holdValidator)
    {
        _availabilityService = availabilityService;
        _holdValidator = holdValidator;
    }

    /// <summary>
    /// Crea un apartado temporal (Hold) para un hospedaje en las fechas seleccionadas con tiempo de expiración (TTL).
    /// Protegido contra bots via Rate Limiting y transacciones de concurrencia atómicas.
    /// </summary>
    [HttpPost("hold")]
    [EnableRateLimiting("HoldEndpointPolicy")]
    [ProducesResponseType(typeof(HoldBookingResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status429TooManyRequests)]
    public async Task<ActionResult<HoldBookingResponseDto>> CreateHold([FromBody] HoldBookingRequestDto request, CancellationToken ct)
    {
        var validationResult = await _holdValidator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var result = await _availabilityService.CreateHoldAsync(request, ct);
        return Ok(result);
    }

    /// <summary>
    /// Confirma la reserva y genera la URL con mensaje pre-llenado de WhatsApp para completar el proceso con atención personalizada.
    /// </summary>
    [HttpPost("confirm-whatsapp")]
    [ProducesResponseType(typeof(ConfirmWhatsAppResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ConfirmWhatsAppResponseDto>> ConfirmWhatsApp([FromBody] ConfirmWhatsAppRequestDto request, CancellationToken ct)
    {
        var result = await _availabilityService.ConfirmWhatsAppBookingAsync(request, ct);
        return Ok(result);
    }
}
