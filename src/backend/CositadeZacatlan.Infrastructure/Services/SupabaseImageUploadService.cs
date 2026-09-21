using System.Net.Http.Headers;
using CositadeZacatlan.Application.Configuration;
using CositadeZacatlan.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace CositadeZacatlan.Infrastructure.Services;

public class SupabaseImageUploadService : IImageUploadService
{
    private readonly HttpClient _httpClient;
    private readonly SupabaseSettings _settings;

    public SupabaseImageUploadService(HttpClient httpClient, IOptions<SupabaseSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }

    public async Task<string?> UploadImageAsync(Stream fileStream, string fileName, CancellationToken ct = default)
    {
        if (fileStream == null || fileStream.Length == 0)
        {
            return null;
        }

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var mimeType = extension switch
        {
            ".png" => "image/png",
            ".webp" => "image/webp",
            ".gif" => "image/gif",
            _ => "image/jpeg",
        };

        var sanitizedFileName = $"{Guid.NewGuid():N}_{Path.GetFileName(fileName).Replace(" ", "_")}";
        var uploadUrl = $"{_settings.Url.TrimEnd('/')}/storage/v1/object/{_settings.BucketName}/{sanitizedFileName}";

        using var request = new HttpRequestMessage(HttpMethod.Post, uploadUrl);

        if (string.IsNullOrEmpty(_settings.ApiKey))
        {
            Console.WriteLine("[Supabase Storage Error]: ApiKey is not configured in appsettings.json (SupabaseSettings:ApiKey).");
            return null;
        }

        request.Headers.Add("apikey", _settings.ApiKey);
        request.Headers.Add("Authorization", $"Bearer {_settings.ApiKey}");

        using var content = new StreamContent(fileStream);
        content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
        request.Content = content;

        var response = await _httpClient.SendAsync(request, ct);

        if (response.IsSuccessStatusCode)
        {
            return $"{_settings.Url.TrimEnd('/')}/storage/v1/object/public/{_settings.BucketName}/{sanitizedFileName}";
        }

        var errorBody = await response.Content.ReadAsStringAsync(ct);
        Console.WriteLine($"[Supabase Storage Error]: Status {response.StatusCode} - {errorBody}");

        return null;
    }
}
