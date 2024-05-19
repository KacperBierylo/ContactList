using Contacts.Data;
using Contacts.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Contacts.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>();

using (var dbContext = new ApplicationDbContext())
{
    dbContext.Database.EnsureCreated();
    dbContext.SaveChanges();
}
//domyœlny schemat uwierzytelniania
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
//opcje tokenu
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "https://localhost:7050",
        ValidAudience = "https://localhost:8080",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"))
    };
});

builder.Services.AddScoped<IAuthService, AuthService>(); // dodaje us³ugê uwierzytelniania jako zale¿noœæ
builder.Services.AddScoped<ICategoriesService, CategoriesService>(); // dodaje us³ugê jako zale¿noœæ
builder.Services.AddScoped<IContactsService, ContactsService>(); // dodaje us³ugê jako zale¿noœæ
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//dodaje politykê dla CORS, pozwalaj¹c¹ na dostêp z dowolnego Ÿród³a
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())    //obs³uga swaggera
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
//dodaje obs³ugê routingu
app.UseRouting();
//dodaje obs³ugê uwierzytelniania
app.UseAuthentication();
//dodaje obs³ugê autoryzacji
app.UseAuthorization();

app.UseCors("AllowAllOrigins");

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    SeedData.Initialize(services);
}

if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.MapFallbackToFile("index.html");
}

app.Run();
