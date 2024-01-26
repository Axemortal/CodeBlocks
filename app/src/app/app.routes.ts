import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/home/layout/layout.component';

export const routes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  { path: '404', component: LayoutComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404' },
];
