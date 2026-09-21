using CositadeZacatlan.Application.Dtos;
using CositadeZacatlan.Application.Interfaces;
using CositadeZacatlan.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CositadeZacatlan.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AccommodationsController : ControllerBase
{
    private readonly IAccommodationRepository _accommodationRepository;
    private readonly IAvailabilityService _availabilityService;

    public AccommodationsController(
        IAccommodationRepository accommodationRepository,
        IAvailabilityService availabilityService)
    {
        _accommodationRepository = accommodationRepository;
        _availabilityService = availabilityService;
    }

    /// <summary>
    /// Obtiene el catálogo completo de hospedajes activos (Cabañas y Habitaciones de Hotel Boutique).
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AccommodationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AccommodationDto>>> GetAll(CancellationToken ct)
    {
        var list = await _accommodationRepository.GetAllActiveAsync(ct);
        var dtos = list.Select(a => new AccommodationDto(
            a.Id,
            a.Name,
            a.Slug,
            a.Description,
            a.Type,
            a.Capacity,
            a.BasePrice,
            a.Amenities,
            a.ImageUrls,
            a.IsActive
        ));

        return Ok(dtos);
    }

    /// <summary>
    /// Obtiene el detalle de un hospedaje específico mediante su slug.
    /// </summary>
    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(AccommodationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AccommodationDto>> GetBySlug(string slug, CancellationToken ct)
    {
        var accommodation = await _accommodationRepository.GetBySlugAsync(slug, ct);
        if (accommodation == null)
        {
            return NotFound(new { message = $"No se encontró el hospedaje con el slug '{slug}'." });
        }

        var dto = new AccommodationDto(
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

        return Ok(dto);
    }

    /// <summary>
    /// Obtiene la lista de fechas disponibles y ocupadas para un hospedaje específico en un mes y año dados.
    /// </summary>
    [HttpGet("{id:guid}/availability")]
    [ProducesResponseType(typeof(MonthlyAvailabilityDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MonthlyAvailabilityDto>> GetMonthlyAvailability(
        Guid id,
        [FromQuery] int month,
        [FromQuery] int year,
        CancellationToken ct)
    {
        if (month < 1 || month > 12 || year < 2026)
        {
            var now = DateTime.UtcNow;
            month = month < 1 || month > 12 ? now.Month : month;
            year = year < 2026 ? now.Year : year;
        }

        var result = await _availabilityService.GetMonthlyAvailabilityAsync(id, month, year, ct);
        if (result == null)
        {
            return NotFound(new { message = $"No se encontró el hospedaje con ID '{id}'." });
        }

        return Ok(result);
    }

    /// <summary>
    /// Obtiene la matriz de ocupación general de las 8 cabañas y 12 habitaciones de hotel boutique para un rango de fechas.
    /// </summary>
    [HttpGet("matrix-availability")]
    [ProducesResponseType(typeof(MatrixAvailabilityDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<MatrixAvailabilityDto>> GetMatrixAvailability(
        [FromQuery] DateOnly? startDate,
        [FromQuery] DateOnly? endDate,
        CancellationToken ct)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var start = startDate ?? today;
        var end = endDate ?? start.AddDays(14);

        var matrix = await _availabilityService.GetMatrixAvailabilityAsync(start, end, ct);
        return Ok(matrix);
    }
}
