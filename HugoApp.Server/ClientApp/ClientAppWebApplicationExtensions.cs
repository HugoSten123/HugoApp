using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace HugoApp.Server.ClientApp;

public static class ClientAppWebApplicationExtensions
{
    public static void UseClientApp(this WebApplication app)
    {
        app.MapWhen(context => !context.Request.Path.StartsWithSegments("/api/"), builder =>
        {
            if (!app.Environment.IsDevelopment())
            {
                builder.UseSpaStaticFiles();
            }

            builder.UseRewriter(new RewriteOptions().AddRedirect("index.html", "/"));
            builder.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp/dist/browser";

                if (app.Environment.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }

                spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
                {
                    OnPrepareResponse = context =>
                    {
                    if (context.File.Name == "index.html")
                    {
                        context.Context.Response.Headers["Cache-Control"] = "no-cache, no-store";
                        context.Context.Response.Headers["Expires"] = "-1";
                    }
                    }
                };
            });
        });
    }
}
