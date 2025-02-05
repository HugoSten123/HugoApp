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
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'Hem',
        pathMatch: 'full',
        component: HomeComponent,
        data: {
          title: 'Hem', 
        },
      },
      {
        path: 'inlägg',
        pathMatch: 'full',
        component: EntriesComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Inlägg', 
        },
      },
      {
        path: 'om',
        pathMatch: 'full',
        component: AboutComponent,
        data: {
          title: 'Om oss', 
        },
      },
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
        data: {
          title: 'Logga in', 
        },
      },
      {
        path: 'entry-detail/:id',
        component: EntryDetailComponent,
        data: {
          title: 'Inlägg Detaljer', 
        },
      },
      {
        path: '',
        redirectTo: 'Hem',
        pathMatch: 'full',
      },
    ],
  },
] as Route[];
