import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './modules/home/home.component';
import { EntriesComponent } from './modules/entries/entries.component';
import { AboutComponent } from './modules/about/about.component';
import { LoginComponent } from './modules/auth/login.component';
import { AuthGuard } from './modules/auth/auth.guard';
import { EntryDetailComponent } from './modules/entry-detail/entry-detail.component';

export default [
  {
    path: '', // Root path, uses LayoutComponent
    component: LayoutComponent,
    data: {
      layout: 'empty', // Empty layout for root
    },
    children: [
      {
        path: 'Hem', // Home page route
        component: HomeComponent,
        data: {
          title: 'Hem',
        },
      },
      {
        path: 'inlägg', // Entries page, requires authentication
        component: EntriesComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Inlägg',
        },
      },
      {
        path: 'om', // About page route
        component: AboutComponent,
        data: {
          title: 'Om',
        },
      },
      {
        path: 'login', // Login page route
        component: LoginComponent,
        data: {
          title: 'Logga in',
        },
      },
      {
        path: 'entry-detail/:id', // Entry details page with dynamic ID
        component: EntryDetailComponent,
        data: {
          title: 'Inlägg Detaljer',
        },
      },
      {
        path: '', // Default route, redirects to Home page
        redirectTo: 'Hem',
        pathMatch: 'full',
      },
    ],
  },
] as Route[];
