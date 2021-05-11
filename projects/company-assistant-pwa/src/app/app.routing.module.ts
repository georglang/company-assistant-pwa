import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SignUpComponent } from './core/auth/sign-up/sign-up.component';
import { SignInComponent } from './core/auth/sign-in/sign-in.component';
import { ForgotpasswordComponent } from './core/auth/forgot-password/forgot-password.component';
import { ImpressumComponent } from './shared/components/impressum/impressum.component';

const routes: Routes = [
  // { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'password-reset', component: ForgotpasswordComponent },
  // { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/order/order.module').then((m) => m.OrderModule)
  },
  {
    path: 'notes',
    loadChildren: () =>
      import('./features/note/note.module').then((m) => m.NoteModule)
  },
  {
    path: 'impressum',
    component: ImpressumComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
