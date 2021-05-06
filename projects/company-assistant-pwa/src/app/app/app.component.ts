import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { from, Observable } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { authLogin, authLogout } from '../core/core.module';
import { selectIsAuthenticated } from '../core/auth/state/auth.selectors';
import { AppState } from '../state/app.state';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';
import { PrintDialogComponent } from '../features/admin/print-dialog/print-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

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

  isAuthenticated$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog
  ) {
    // this.authService.bootstrapOAuthService();
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
    // if (this.authService.hasValidAccessToken()) {
    //   this.store.dispatch(authLogin());
    // } else {
    //   this.localStorageService.removeItem(AUTH_KEY);
    // }

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.store.dispatch(authLogin());
      }
    });
  }

  login(): void {
    // this.authService.signUp();
  }

  logout(): void {
    this.authService.logout();
    this.store.dispatch(authLogout());
  }

  hasValidAccessToken(): void {}

  doBeforeUnload(): void {
    this.localStorageService.removeItem(AUTH_KEY);
  }

  openPrintDialog(): void {
    const dialogRef = this.dialog.open(
      PrintDialogComponent,
      this.createDialogConfig()
    );

    dialogRef.afterClosed().subscribe((dialogResult) => {
      debugger;
    });
  }

  private createDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '350px';
    return dialogConfig;
  }
}
