import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { SignUpComponent } from './core/auth/sign-up/sign-up.component';
import { SignInComponent } from './core/auth/sign-in/sign-in.component';
import { ForgotpasswordComponent } from './core/auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'password-reset', component: ForgotpasswordComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/order/order.module').then((m) => m.OrderModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
