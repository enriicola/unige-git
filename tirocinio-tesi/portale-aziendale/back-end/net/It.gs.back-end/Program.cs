using It.gs.ApiVersioning;
using It.gs.backend.Model;
using It.gs.backend.QueryExecutors;
using It.gs.backend.Requirements;
using It.gs.backend.Services.Implementations;
using It.gs.backend.Services.Interfaces;
using It.gs.Repository;
using It.gs.Repository.Settings;
using It.gs.Repository.Utilities;
using It.gs.Swagger;
using It.gs.Swagger.Settings;
using It.gs.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Logging;
using Serilog;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.Reflection;
using static It.gs.Utilities.Functions;

IdentityModelEventSource.ShowPII = true;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();
builder.WebHost.UseIISIntegration();

// Add services to the container.
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("Database"));
builder.Services.Configure<SwaggerSettings>(builder.Configuration.GetSection("Swagger"));
builder.Services.Configure<OAuthSettings>(builder.Configuration.GetSection("OAuth"));
builder.Services.Configure<ApiSettings>(options => builder.Configuration.GetSection("Api").Bind(options));
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("Mail"));
builder.Services.Configure<FileChunkSettings>(builder.Configuration.GetSection("FileChunk"));


builder.Services.AddMaker(); // GS
builder.Services.AddLoggerFactory(); // GS

builder.Services.AddCors();

var externalControllersAssemblies = new List<Assembly>(); //LoadExternalControllersAssemblies(services);

Helper.AddCustomAuth(builder.Services, externalControllersAssemblies); // GS

builder.Services.AddGsApiVersioning(); // GS

builder.Services.AddRepositoryConnectionFactory(); //GS
builder.Services.AddCustomHealthChecks(); //GS

var migrationsAssemblies = new Assembly[] { typeof(Program).Assembly };

builder.Services.AddGetListExecutor<NoticeData, NoticeDataGetListExecutor>(migrationsAssemblies);
builder.Services.AddAddExecutor<NoticeData, NoticeDataGetListExecutor>(migrationsAssemblies);
builder.Services.AddExecuteWithTransactionExecutor<NoticeData, NoticeDataExecuteExecutor>(migrationsAssemblies);

builder.Services.AddGetListExecutor<OfficesData, OfficesDataGetListExecutor>(migrationsAssemblies);
builder.Services.AddAddExecutor<OfficesData, OfficesDataGetListExecutor>(migrationsAssemblies);
builder.Services.AddExecuteWithTransactionExecutor<OfficesData, OfficesDataExecuteExecutor>(migrationsAssemblies);

builder.Services.AddGetListExecutor<CoursesData, CoursesDataGetListExecutor>(migrationsAssemblies);
builder.Services.AddAddExecutor<CoursesData, CoursesDataGetListExecutor>(migrationsAssemblies);
builder.Services.AddExecuteWithTransactionExecutor<CoursesData, CoursesDataExecuteExecutor>(migrationsAssemblies);

builder.Services.AddGetListExecutor<BookingCoursesData, BookingCoursesDataGetListExecutor>(migrationsAssemblies);   

builder.Services.AddControllers();

Helper.LoadExternal<ExternalControllerAttribute, IExternalController>(externalControllersAssemblies, (assembly, ec) =>
{
    ec.AddExternalCrudController(builder.Services);
    builder.Services.AddControllers().AddApplicationPart(assembly);
});

builder.Services.AddSpaStaticFiles(c => { c.RootPath = "wwwroot"; });
builder.Services.AddSwagger(externalControllersAssemblies); // GS

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/*builder.Services.AddHttpClient("httpclient", (sp, httpClient) =>
{
    var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
    var apiSettings = sp.GetRequiredService<IOptions<ApiSettings>>().Value;
    var bearerToken = httpContextAccessor.HttpContext.Request.Headers["Authorization"]
        .FirstOrDefault(h => h.StartsWith("bearer ", StringComparison.InvariantCultureIgnoreCase));

    httpClient.BaseAddress = new Uri(apiSettings.BaseAddress);
    if (bearerToken != null)
    {
        httpClient.DefaultRequestHeaders.Add("Authorization", bearerToken);
    }
    httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
}).ConfigurePrimaryHttpMessageHandler((sp) =>
{
    var handler = new HttpClientHandler();
    if (Debugger.IsAttached)
    {
        handler.ServerCertificateCustomValidationCallback = (message, certificate, chain, errors) =>
        {
            // Debugger.Break();
            return true;
        };
    }
    return handler;
});*/

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization();

app.Services.GetService<IMaker>(); // GS
var apiVersionDescriptionProvider = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

app.UseCustomSwagger(apiVersionDescriptionProvider); // GS

app.UseHealthCheck(); // GS

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();

public static class Helper
{
    public static void AddCustomAuth(IServiceCollection services, IEnumerable<Assembly> externalControllerAssemblies)
    {
        var authBuilder = services.AddAuthentication(o =>
        {
            o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        });
        authBuilder.AddJwtBearer(options =>
        {
            var oauthSettings = services.BuildServiceProvider().GetRequiredService<IOptions<OAuthSettings>>().Value;
            options.Authority = oauthSettings.Authority;
            options.Audience = oauthSettings.Audience;
            options.Events = new JwtBearerEvents();

            var handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = (message, certificate, chain, errors) =>
            {
                // Debugger.Break();
                return true;
            };
            options.BackchannelHttpHandler = handler;

            if (Debugger.IsAttached)
            {
                options.Events.OnAuthenticationFailed = context =>
                {
                    LogError(context.Exception.Message);
                    // Debugger.Break();
                    // context.Success();
                    return Task.CompletedTask;
                };
            }
        });

        services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.Base, policy =>
            {
                policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                policy.RequireAuthenticatedUser();
                policy.Requirements.Add(new GsStarterRequirement());
            });

            LoadExternal<AuthorizationRequirementAttribute, IAuthorizationRequirement>(externalControllerAssemblies, (assembly, ar) =>
            {
                options.AddPolicy(((IPolicyName)ar).Name, policy =>
                {
                    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                    policy.Requirements.Add(ar);
                });
            });
        });
        services.AddSingleton<IAuthorizationHandler, GsStarterHandler>();

        services.AddSingleton<IRoleCheckerService, KeyCloakRoleCheckerService>();

        LoadExternal<AuthorizationHandlerAttribute, IAuthorizationHandler>(externalControllerAssemblies, (assembly, ar) => services.AddSingleton(_ => ar));

        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
    }

    public static IEnumerable<Assembly> LoadExternalControllersAssemblies(IServiceCollection services)
    {
        var codebase = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
        var path = Path.Combine(codebase, "externalControllers");

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        var loadResults = TryEach(Directory.GetFiles(path, "*.dll"), file => Assembly.LoadFrom(file));
        if (!loadResults.Any())
            throw new Exception($"External controller folder {path} is Empty!");

        Each(loadResults.Where(r => r.IsFailure), r => LogError($"Error Loading External Controller Dll: {r.Error}"));

        return loadResults.Where(r => r.IsSuccess).Select(r => r.Value);
    }

    public static void LoadExternal<A, I>(IEnumerable<Assembly> externalControllersAssemblies, Action<Assembly, I> @do) where A : Attribute
    {
        var loadResults = TryEach(externalControllersAssemblies, assembly =>
        {
            var externalTypes = assembly.GetLoadableTypes().Where(type => type.GetCustomAttributes<A>().Any());
            foreach (var externalType in externalTypes)
            {
                var externalObject = (I)Activator.CreateInstance(externalType);
                if (externalObject != null)
                {
                    @do(assembly, externalObject);
                }
            }
        });
        Each(loadResults.Where(r => r.IsFailure), r => LogError($"Error Loading {typeof(I).FullName}: {r.Error}"));
    }
}
