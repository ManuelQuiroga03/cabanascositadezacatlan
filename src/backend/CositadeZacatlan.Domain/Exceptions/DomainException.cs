namespace CositadeZacatlan.Domain.Exceptions;

public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message)
    {
    }
}

public class AlreadyBookedException : DomainException
{
    public AlreadyBookedException(string message = "Las fechas seleccionadas ya se encuentran ocupadas o reservadas.")
        : base(message)
    {
    }
}

public class NotFoundException : DomainException
{
    public NotFoundException(string message) : base(message)
    {
    }
}
