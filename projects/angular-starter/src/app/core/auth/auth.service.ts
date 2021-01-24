import { Injectable } from '@angular/core';
import {
  OAuthEvent,
  OAuthService,
  TokenResponse
} from 'angular-oauth2-oidc';
import { Observable, Subject } from 'rxjs';
import { authConfigPKCE } from './auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$: Observable<boolean>;
  private isLoggedInSubject: Subject<boolean>;

  constructor(private oAuthService: OAuthService) {
    this.isLoggedInSubject = new Subject<boolean>();
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  bootstrapOAuthService(): void {
    this.oAuthService.configure(authConfigPKCE);
    this.oAuthService.setupAutomaticSilentRefresh();

    this.oAuthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'token_received') {
        this.isLoggedInSubject.next(true);
      }
    });

    const url = '';

    // The convenience method mentioned in the docs (loadDiscoveryDocumentAndLogin) won't work
    // since we need a way to modify the token endpoint
    this.oAuthService
      .loadDiscoveryDocument(url)
      .then(() => {
        if (this.userHasEnteredPasswordResetFlow()) {
          // We need to change to token endpoint to match the reset-password flow
        }

        return this.oAuthService.tryLoginCodeFlow();
      })
      .catch((err) => {});
  }

  private userHasEnteredPasswordResetFlow(): boolean {
    return window.location.search.indexOf('PASSWORD_RESET') > -1;
  }

  login(): void {
    if (!this.oAuthService.hasValidAccessToken()) {
      this.oAuthService.initCodeFlow();
    }
  }

  logout(): void {
    this.oAuthService.logOut();
  }

  refreshToken(): Promise<TokenResponse> {
    return this.oAuthService.refreshToken();
  }

  hasValidAccessToken(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  get claims(): Record<string, unknown> {
    return this.oAuthService.getIdentityClaims() as Record<string, unknown>;
  }
}
