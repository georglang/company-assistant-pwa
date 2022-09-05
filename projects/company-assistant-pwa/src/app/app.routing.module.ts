import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SignUpComponent } from './core/auth/sign-up/sign-up.component';
import { SignInComponent } from './core/auth/sign-in/sign-in.component';
import { ForgotpasswordComponent } from './core/auth/forgot-password/forgot-password.component';
import { ImpressumComponent } from './shared/components/impressum/impressum.component';
import { AdminGuard } from './core/auth/guards/admin.guard';
import { CanReadGuard } from './core/auth/guards/can-read.guard';
import { AdminComponent } from './features/admin/admin.component';
import {
  AngularFireAuthGuard,
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo
} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToOrders = () => redirectLoggedInTo(['orders']);

const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  // { path: 'admin', component: AdminComponent}
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/order/order.module').then((m) => m.OrderModule),
    canActivate: [CanReadGuard]
    // canActivate: [AngularFireAuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'archive',
    loadChildren: () =>
      import('./features/archive/archive.module').then((m) => m.ArchiveModule)
  },
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('./features/admin/admin.module').then((m) => m.AdminModule),
  // }
  // {
  //   path: 'notes',
  //   loadChildren: () =>
  //     import('./features/note/note.module').then((m) => m.NoteModule)
  // },
  // {
  //   path: 'impressum',
  //   component: ImpressumComponent
  // },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'password-reset', component: ForgotpasswordComponent }
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
