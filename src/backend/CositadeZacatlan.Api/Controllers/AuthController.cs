using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CositadeZacatlan.Application.Configuration;
using CositadeZacatlan.Application.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace CositadeZacatlan.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly BusinessSettings _settings;

    public AuthController(IOptions<BusinessSettings> settingsOptions)
    {
        _settings = settingsOptions.Value;
    }

    /// <summary>
    /// Autentica las credenciales de recepción/administración y genera un token JWT firmado.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Login([FromBody] LoginRequestDto request)
    {
        if (request.Username != _settings.AdminUsername || request.Password != _settings.AdminPassword)
        {
            return Unauthorized(new { message = "Credenciales de administrador inválidas." });
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_settings.JwtSecretKey);

        var expiresAtUtc = DateTime.UtcNow.AddHours(8);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, request.Username),
                new Claim(ClaimTypes.Role, "Admin")
            }),
            Expires = expiresAtUtc,
            Issuer = _settings.JwtIssuer,
            Audience = _settings.JwtAudience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new LoginResponseDto(
            tokenString,
            request.Username,
            expiresAtUtc,
            "Inicio de sesión exitoso como Administrador."
        ));
    }
}
