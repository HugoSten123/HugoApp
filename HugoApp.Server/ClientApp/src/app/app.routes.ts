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
      },
      {
        path: 'inlägg',
        pathMatch: 'full',
        component: EntriesComponent,
        canActivate: [AuthGuard], 
      },
      {
        path: 'om',
        pathMatch: 'full',
        component: AboutComponent,
      },
      {
        path: 'login',
        pathMatch: 'full',
        component: LoginComponent,
      },
      {
        path: 'entry-detail/:id',
        component: EntryDetailComponent,
      }
    ],
  },
] as Route[];
