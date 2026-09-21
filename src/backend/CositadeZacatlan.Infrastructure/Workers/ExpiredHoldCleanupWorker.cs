using CositadeZacatlan.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CositadeZacatlan.Infrastructure.Workers;

public class ExpiredHoldCleanupWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ExpiredHoldCleanupWorker> _logger;

    public ExpiredHoldCleanupWorker(IServiceScopeFactory scopeFactory, ILogger<ExpiredHoldCleanupWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ExpiredHoldCleanupWorker iniciado. Ejecutando verificación cada 60 segundos.");

        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(60));

        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var availabilityService = scope.ServiceProvider.GetRequiredService<IAvailabilityService>();

                int cleanedCount = await availabilityService.CleanupExpiredHoldsAsync(stoppingToken);
                if (cleanedCount > 0)
                {
                    _logger.LogInformation("ExpiredHoldCleanupWorker: Se marcaron {Count} apartados temporales vencidos como expirados.", cleanedCount);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al ejecutar ExpiredHoldCleanupWorker.");
            }
        }
    }
}
