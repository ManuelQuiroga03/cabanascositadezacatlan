using CositadeZacatlan.Application.Dtos;
using FluentValidation;

namespace CositadeZacatlan.Application.Validators;

public class HoldBookingRequestValidator : AbstractValidator<HoldBookingRequestDto>
{
    public HoldBookingRequestValidator()
    {
        RuleFor(x => x.AccommodationId)
            .NotEmpty()
            .WithMessage("El identificador del hospedaje es obligatorio.");

        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("El nombre del cliente es obligatorio.")
            .Length(3, 100).WithMessage("El nombre debe tener entre 3 y 100 caracteres.");

        RuleFor(x => x.CustomerPhone)
            .NotEmpty().WithMessage("El número de teléfono o WhatsApp es obligatorio.")
            .Matches(@"^[0-9\+\-\s\(\)]{10,20}$").WithMessage("El número de teléfono debe tener un formato válido de al menos 10 dígitos.");

        RuleFor(x => x.CheckInDate)
            .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("La fecha de llegada no puede ser una fecha pasada.");

        RuleFor(x => x.CheckOutDate)
            .GreaterThan(x => x.CheckInDate)
            .WithMessage("La fecha de salida debe ser posterior a la fecha de llegada.");
    }
}
