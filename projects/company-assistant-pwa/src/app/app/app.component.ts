import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { from, Observable } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { authLogin, authLogout } from '../core/core.module';
import { selectIsAuthenticated } from '../core/auth/state/auth.selectors';
import { AppState } from '../state/app.state';
import { LocalStorageService } from '../core/services/local-storage/local-storage.service';
import { PrintDialogComponent } from '../shared/components/print-dialog/print-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrintService } from '../core/services/print-service/print.service';
import { IUser } from '../core/auth/user';
import { FireFunctionsService } from '../core/services/fire-functions/fire-functions.service';
import { NewAuthService } from '../shared/services/newAuth.service';
import { SearchService } from '../shared/services/search.service';

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

  user: IUser;

  toggleSearch: boolean = false;
  @ViewChild('searchbar') searchbar: ElementRef;
  searchText = '';

  constructor(
    private store: Store<AppState>,
    private authService: NewAuthService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private printService: PrintService,
    private fireFunctionService: FireFunctionsService,
    private searchService: SearchService
  ) {
    // this.authService.bootstrapOAuthService();
  }

  ngOnInit(): void {
    // ToDo: NgRx einbinden
    // this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));

    this.isAuthenticated$ = this.authService.isAuthenticated$;

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

  searchInputChanged(searchText: string): void {
    this.searchService.changeSearchText(searchText);
  }

  login(): void {
    // this.authService.signUp();
  }

  logout(): void {
    this.authService.logout();
    // this.store.dispatch(authLogout());
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
      if (dialogResult.shouldPrint) {
        if (dialogResult.order !== undefined) {
          this.printService.print(
            dialogResult.order,
            dialogResult.categoriesToPrint
          );
        }
      }
    });
  }

  private createDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '350px';
    return dialogConfig;
  }

  callHelloWorld() {
    this.fireFunctionService.callHelloWorld();
  }

  openSearch() {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose() {
    this.searchText = '';
    this.toggleSearch = false;
  }
}
