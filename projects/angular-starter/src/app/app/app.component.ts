import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { authLogin, authLogout } from '../core/core.module';
import { selectIsAuthenticated } from '../core/auth/state/auth.selectors';
import { AppState } from '../state/app.state';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';

const AUTH_KEY = 'Auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-starter';
  navigation = [
    { link: 'home', label: 'Home' },
    { link: 'about', label: 'Über Uns' }
  ];

  navigationSideMenu = [...this.navigation];

  logo = './../assets/img/logo.png';
  year = new Date().getFullYear();

  isAuthenticated$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    this.authService.bootstrapOAuthService();
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    if (this.authService.hasValidAccessToken()) {
      this.store.dispatch(authLogin());
    } else {
      this.localStorageService.removeItem(AUTH_KEY);
    }

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.store.dispatch(authLogin());
      }
    });
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
    this.store.dispatch(authLogout());
  }

  hasValidAccessToken(): boolean {
    return this.authService.hasValidAccessToken();
  }

  doBeforeUnload(): void {
    this.localStorageService.removeItem(AUTH_KEY);
  }

  get claims(): Record<string, unknown> {
    return this.authService.claims;
  }
}
