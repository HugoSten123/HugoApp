import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from "@angular/router";
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFuse } from '@fuse';
import appRoutes from "./app.routes";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideIcons } from "./core/icons/icons.provider";

// Configuration for the Angular app
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // Enable animations across the app
    provideRouter( // Set up the router with preloading and scroll behavior
      appRoutes, // Define the app's routes
      withPreloading(PreloadAllModules), // Preload all app modules for faster navigation
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) // Keep scroll position when navigating
    ),
    provideHttpClient(withInterceptorsFromDi()), // Set up HTTP client with automatic request interceptors
    provideIcons(), // Provide icons for use in the app
    provideFuse({ // Configure Fuse layout and themes
      fuse: {
        layout: 'classy',
        scheme: 'light', 
        screens: { // Define screen sizes for responsive design

          //screen sizes
          sm: '600px', 
          md: '960px', 
          lg: '1280px',
          xl: '1440px', 
        },
        theme: 'theme-default', // Set the default theme
        themes: [ // List of available themes
          { id: 'theme-default', name: 'Default' },
          { id: 'theme-brand', name: 'Brand' },
          { id: 'theme-teal', name: 'Teal' },
          { id: 'theme-rose', name: 'Rose' },
          { id: 'theme-purple', name: 'Purple' },
          { id: 'theme-amber', name: 'Amber' },
        ],
      },
    })
  ]
};
