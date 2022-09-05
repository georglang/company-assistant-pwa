import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import {
  Router,
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { tap, map, take, switchMap } from 'rxjs/operators';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean> {
    return this.firebaseAuth.authState.pipe(
      take(1),
      switchMap(async (authState) => {
        if (authState) {
          const user$ = await this.authService.getUserFromDb(authState.uid);
          user$.subscribe((user) => {
            if (!user) {
              this.router.navigate(['./sign-in']);
              return false;
            }
            if (user && user.roles.admin) {
              this.router.navigate(['./admin']);
              return true;
            } else {
              this.router.navigate(['./sign-in']);
              debugger;
              return false;
            }
          });
        } else {
          this.router.navigate(['./sign-in']);
          return false;
        }
      })
    );

    // return this.authService.userChangedObs$.pipe(
    //   take(1),
    //   map((user) => (user && this.authService.isAdmin(user) ? true : false)),
    //   tap((isAdmin) => {
    //     debugger;
    //     if (!isAdmin) {
    //       console.error('OWN ERROR: ACCESS DENIED - ADMINS ONLY');
    //       this.router.navigateByUrl('/sign-in');
    //       // show not Authorized Toast message and redirect to sign-in
    //     }
    //   })
    // );
  }
}
