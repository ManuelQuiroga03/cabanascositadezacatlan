using System.Text;
using System.Threading.RateLimiting;
using CositadeZacatlan.Api.Middleware;
using CositadeZacatlan.Application.Configuration;
using CositadeZacatlan.Application.Interfaces;
using CositadeZacatlan.Application.Services;
using CositadeZacatlan.Application.Validators;
using CositadeZacatlan.Domain.Interfaces;
using CositadeZacatlan.Infrastructure.Persistence;
using CositadeZacatlan.Infrastructure.Repositories;
using CositadeZacatlan.Infrastructure.Workers;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Business Settings Configuration
builder.Services.Configure<BusinessSettings>(
    builder.Configuration.GetSection(BusinessSettings.SectionName));
builder.Services.Configure<SupabaseSettings>(
    builder.Configuration.GetSection("SupabaseSettings"));

// 2. Database Context Setup (PostgreSQL with EF Core)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseInMemoryDatabase("ZacatlanDb"));
}

// 3. Register Repositories, UnitOfWork, Services, and Workers
builder.Services.AddHttpClient();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAccommodationRepository, AccommodationRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBlockedDateRepository, BlockedDateRepository>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IImageUploadService, CositadeZacatlan.Infrastructure.Services.SupabaseImageUploadService>();

// Register Background Worker for Expired Holds Cleanup
builder.Services.AddHostedService<ExpiredHoldCleanupWorker>();

// 4. Register FluentValidation Validators
builder.Services.AddValidatorsFromAssemblyContaining<HoldBookingRequestValidator>();

// 5. JWT Bearer Authentication & Authorization Setup
var jwtSecretKey = builder.Configuration["BusinessSettings:JwtSecretKey"] ?? "ZacatlanSuperSecretSecurityKey2026!UnaCositaDeZacatlanTokenSecret";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["BusinessSettings:JwtIssuer"] ?? "CositadeZacatlan.Api",
            ValidateAudience = true,
            ValidAudience = builder.Configuration["BusinessSettings:JwtAudience"] ?? "CositadeZacatlan.Client",
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

// 6. Rate Limiting Configuration (Antibot Protection on /hold endpoints)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("HoldEndpointPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

// 7. Controllers & JSON Options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// 8. Swagger / OpenAPI Configuration with Bearer Authorization Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "CositadeZacatlan.Api",
        Version = "v1",
        Description = "API de Reservaciones Una Cosita de Zacatlán con Autenticación JWT"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingrese su Token JWT obtenido del endpoint /api/v1/Auth/login"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 9. CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowViteClient", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://localhost:4173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Enable Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CositadeZacatlan.Api v1");
        c.RoutePrefix = "swagger";
    });
}

// Enable Global Exception Middleware (RFC 7807 ProblemDetails)
app.UseMiddleware<GlobalExceptionMiddleware>();

// Ensure DbContext Seed Data or Migration is applied on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (dbContext.Database.IsNpgsql())
    {
        dbContext.Database.Migrate();
    }
    else
    {
        dbContext.Database.EnsureCreated();
    }
}

app.UseCors("AllowViteClient");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
