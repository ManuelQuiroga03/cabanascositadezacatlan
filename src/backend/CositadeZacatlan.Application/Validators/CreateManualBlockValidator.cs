using CositadeZacatlan.Application.Dtos;
using FluentValidation;

namespace CositadeZacatlan.Application.Validators;

public class CreateManualBlockValidator : AbstractValidator<CreateManualBlockDto>
{
    public CreateManualBlockValidator()
    {
        RuleFor(x => x.AccommodationId)
            .NotEmpty()
            .WithMessage("El identificador del hospedaje es obligatorio.");

        RuleFor(x => x.Date)
            .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("No se pueden bloquear fechas en el pasado.");
    }
}
