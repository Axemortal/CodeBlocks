import { Routes } from '@angular/router';
import { LayoutComponent as HomeLayoutComponent } from './modules/home/layout/layout.component';
import { LayoutComponent as NotFoundLayoutComponent } from './modules/not-found/layout/layout.component';
import { LayoutComponent as TranslatorLayoutComponent } from './modules/translator/layout/layout.component';
import { LayoutComponent as InstructionsLayoutComponent } from './modules/instructions/layout/layout.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeLayoutComponent,
    pathMatch: 'full',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'translator',
    component: TranslatorLayoutComponent,
    pathMatch: 'full',
    loadChildren: () =>
      import('./modules/translator/translator.module').then(
        (m) => m.TranslatorModule
      ),
  },
  {
    path: 'instructions',
    component: InstructionsLayoutComponent,
    pathMatch: 'full',
    loadChildren: () =>
      import('./modules/instructions/instructions.module').then(
        (m) => m.InstructionsModule
      ),
  },
  {
    path: '404',
    component: NotFoundLayoutComponent,
    pathMatch: 'full',
    loadChildren: () =>
      import('./modules/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404' },
];
