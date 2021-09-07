import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { tap, map, take } from 'rxjs/operators';
import { NewAuthService } from '../../../shared/services/newAuth.service';

@Injectable({ providedIn: 'root' })
export class CanReadGuard implements CanActivate {
  constructor(private authService: NewAuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn !== true) {
      this.router.navigate(['sign-in']);
    }
    return true;
  }

  // advanced with user role
  // canActivate(): Observable<boolean> {
  //   return this.authService.userChangedObs$.pipe(
  //     take(1),
  //     map((user) => {
  //       if (user && this.authService.canRead(user)) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }),
  //     tap((canRead) => {
  //       if (!canRead) {
  //         console.error('OWN ERROR: ACCESS DENIED - ADMINS ONLY');
  //         this.router.navigateByUrl('/sign-in');
  //         // show not Authorized Toast message and redirect to sign-in
  //       }
  //     })
  //   );
  // }
}
