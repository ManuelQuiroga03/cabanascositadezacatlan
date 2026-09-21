using CositadeZacatlan.Application.Dtos;
using CositadeZacatlan.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CositadeZacatlan.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IImageUploadService _imageUploadService;

    public AdminController(IAdminService adminService, IImageUploadService imageUploadService)
    {
        _adminService = adminService;
        _imageUploadService = imageUploadService;
    }

    /// <summary>
    /// Sube una fotografía a Cloudinary y retorna la URL segura HTTPS resultante.
    /// </summary>
    [HttpPost("upload-image")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ImageUploadResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ImageUploadResponseDto>> UploadImage(IFormFile file, CancellationToken ct)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No se ha proporcionado un archivo de imagen válido." });
        }

        using var stream = file.OpenReadStream();
        var imageUrl = await _imageUploadService.UploadImageAsync(stream, file.FileName, ct);

        if (string.IsNullOrEmpty(imageUrl))
        {
            return BadRequest(new { message = "Ocurrió un error al subir la imagen a Cloudinary." });
        }

        return Ok(new ImageUploadResponseDto(imageUrl));
    }

    /// <summary>
    /// Actualiza los detalles, precio base, amenidades y galería de imágenes de un hospedaje.
    /// </summary>
    [HttpPut("accommodations/{id:guid}")]
    [ProducesResponseType(typeof(AccommodationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AccommodationDto>> UpdateAccommodation(Guid id, [FromBody] UpdateAccommodationDto request, CancellationToken ct)
    {
        var result = await _adminService.UpdateAccommodationAsync(id, request, ct);
        if (result == null)
        {
            return NotFound(new { message = $"No se encontró el hospedaje con ID '{id}'." });
        }
        return Ok(result);
    }

    /// <summary>
    /// Bloquea una fecha específica manualmente para una cabaña o habitación (mantenimiento o reserva telefónica).
    /// </summary>
    [HttpPost("blocks")]
    [ProducesResponseType(typeof(BlockedDateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<BlockedDateDto>> CreateBlock([FromBody] CreateManualBlockDto request, CancellationToken ct)
    {
        var result = await _adminService.CreateBlockAsync(request, ct);
        if (result == null)
        {
            return BadRequest(new { message = "No se pudo realizar el bloqueo. Verifique que el hospedaje exista." });
        }
        return Ok(result);
    }

    /// <summary>
    /// Elimina un bloqueo manual de fecha previamente registrado.
    /// </summary>
    [HttpDelete("blocks/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteBlock(Guid id, CancellationToken ct)
    {
        await _adminService.DeleteBlockAsync(id, ct);
        return NoContent();
    }

    /// <summary>
    /// Confirma una reserva pendiente en estado PendingHold tras verificar el pago o anticipo.
    /// </summary>
    [HttpPatch("bookings/{id}/confirm")]
    [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<BookingDetailDto>> ConfirmBooking(Guid id, CancellationToken ct)
    {
        var result = await _adminService.ConfirmBookingAsync(id, ct);
        if (result == null)
        {
            return NotFound(new { message = $"No se encontró la reserva con ID '{id}'." });
        }
        return Ok(result);
    }

    /// <summary>
    /// Obtiene las métricas principales del tablero de administración.
    /// </summary>
    [HttpGet("dashboard-stats")]
    [ProducesResponseType(typeof(DashboardStatsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats(CancellationToken ct)
    {
        var stats = await _adminService.GetDashboardStatsAsync(ct);
        return Ok(stats);
    }

    /// <summary>
    /// Obtiene la lista de apartados pendientes por confirmar (PendingHold activos).
    /// </summary>
    [HttpGet("pending-holds")]
    [ProducesResponseType(typeof(IEnumerable<BookingDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<BookingDetailDto>>> GetPendingHolds(CancellationToken ct)
    {
        var holds = await _adminService.GetPendingHoldsAsync(ct);
        return Ok(holds);
    }
}
