import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PrintService } from '../../core/services/print-service/print.service';
import { PrintDialogComponent } from '../../shared/components/print-dialog/print-dialog.component';
import { NewAuthService } from '../../shared/services/newAuth.service';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searchbar') searchbar: ElementRef;
  toggleSearch: boolean = false;
  isAuthenticated$: Observable<boolean>;
  searchText = '';

  constructor(
    public dialog: MatDialog,
    private printService: PrintService,
    private authService: NewAuthService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  login(): void {
    // this.authService.signUp();
  }

  logout(): void {
    this.authService.logout();
    // this.store.dispatch(authLogout());
  }

  searchInputChanged(searchText: string): void {
    this.searchService.changeSearchText(searchText);
  }

  openSearch(): void {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose(): void {
    this.searchText = '';
    this.toggleSearch = false;
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
}
