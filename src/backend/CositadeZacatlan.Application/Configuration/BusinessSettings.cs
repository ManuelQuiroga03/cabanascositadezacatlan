namespace CositadeZacatlan.Application.Configuration;

public class BusinessSettings
{
    public const string SectionName = "BusinessSettings";

    public string WhatsAppPhoneNumber { get; set; } = "527971234567";
    public int HoldTtlMinutes { get; set; } = 15;
    public string AdminUsername { get; set; } = "admin";
    public string AdminPassword { get; set; } = "ZacatlanAdmin2026!";
    public string JwtSecretKey { get; set; } = "ZacatlanSuperSecretSecurityKey2026!UnaCositaDeZacatlanTokenSecret";
    public string JwtIssuer { get; set; } = "CositadeZacatlan.Api";
    public string JwtAudience { get; set; } = "CositadeZacatlan.Client";
}
