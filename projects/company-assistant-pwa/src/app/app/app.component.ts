import { Component, OnInit } from '@angular/core';

import { AppState } from '../state/app.state';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';
import { IUser } from '../core/auth/user';

const AUTH_KEY = 'Auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'company-assistant-pwa';
  navigation = [
    { link: 'home', label: 'Home' },
    { link: 'about', label: 'Über Uns' }
  ];

  navigationSideMenu = [...this.navigation];

  logo = './../assets/img/logo.png';
  year = new Date().getFullYear();

  user: IUser;

  constructor(private localStorageService: LocalStorageService) {
    // this.authService.bootstrapOAuthService();
  }

  ngOnInit(): void {
    // ToDo: NgRx einbinden
    // this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    // this.authService.userChangedObs$.subscribe((user: IUser) => {
    //   this.user = user;
    // });
    // if (this.authService.hasValidAccessToken()) {
    //   this.store.dispatch(authLogin());
    // } else {
    //   this.localStorageService.removeItem(AUTH_KEY);
    // }
    // this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
    //   if (isLoggedIn) {
    //     this.store.dispatch(authLogin());
    //   }
    // });
  }

  hasValidAccessToken(): void {}

  doBeforeUnload(): void {
    this.localStorageService.removeItem(AUTH_KEY);
  }
}
