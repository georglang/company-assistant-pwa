import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

const AUTH_KEY = 'Auth';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}
  login = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLogin),
        tap(() => {
          this.localStorageService.setItem(AUTH_KEY, {
            isAuthenticated: true
          });
        })
      ),
    { dispatch: false }
  );

  logout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLogout),
        tap(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          this.router.navigate(['']);
          this.localStorageService.setItem(AUTH_KEY, {
            isAuthenticated: false
          });
        })
      ),
    { dispatch: false }
  );
}
