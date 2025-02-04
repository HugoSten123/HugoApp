using Microsoft.Extensions.DependencyInjection;

namespace HugoApp.Server.ClientApp;

public static class ClientAppServiceCollectionExtensions
{
    public static void AddClientApp(this IServiceCollection services)
    {
        services.AddSpaStaticFiles(configuration =>
        {
            
            configuration.RootPath = "ClientApp/dist/browser";
        });
    }
}
