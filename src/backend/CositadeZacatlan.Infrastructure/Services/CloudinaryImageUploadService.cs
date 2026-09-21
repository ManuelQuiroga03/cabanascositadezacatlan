using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using CositadeZacatlan.Application.Configuration;
using CositadeZacatlan.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace CositadeZacatlan.Infrastructure.Services;

public class CloudinaryImageUploadService : IImageUploadService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryImageUploadService(IOptions<CloudinarySettings> config)
    {
        var settings = config.Value;
        var account = new Account(
            settings.CloudName,
            settings.ApiKey,
            settings.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string?> UploadImageAsync(Stream fileStream, string fileName, CancellationToken ct = default)
    {
        if (fileStream == null || fileStream.Length == 0)
        {
            return null;
        }

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "cositadezacatlan/accommodations",
            Transformation = new Transformation().Quality("auto").FetchFormat("auto")
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams, ct);

        if (uploadResult.Error != null)
        {
            Console.WriteLine($"[Cloudinary Error]: {uploadResult.Error.Message}");
            return null;
        }

        if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK && uploadResult.SecureUrl != null)
        {
            return uploadResult.SecureUrl.ToString();
        }

        return null;
    }
}
