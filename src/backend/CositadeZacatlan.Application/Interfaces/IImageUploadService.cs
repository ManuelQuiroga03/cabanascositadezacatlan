namespace CositadeZacatlan.Application.Interfaces;

public interface IImageUploadService
{
    Task<string?> UploadImageAsync(Stream fileStream, string fileName, CancellationToken ct = default);
}
