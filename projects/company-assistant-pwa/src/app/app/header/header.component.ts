import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PrintService } from '../../core/services/print-service/print.service';
import { PrintDialogComponent } from '../../shared/components/print-dialog/print-dialog.component';
import { NewAuthService } from '../../shared/services/newAuth.service';
import { SearchService } from '../../shared/services/search.service';
import { FirestoreArchiveService } from '../../features/archive/services/firestore-archive.service/firestore-archive.service';
import { PrintAndArchiveDialogReturnValue } from '../../shared/components/print-dialog/PrintAndArchiveReturnValue';

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
    private searchService: SearchService,
    private archiveService: FirestoreArchiveService
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

    dialogRef
      .afterClosed()
      .subscribe((dialogResult: PrintAndArchiveDialogReturnValue) => {
        if (dialogResult.shouldPrint) {
          if (dialogResult.orderToPrint) {
            this.printService.print(
              dialogResult.orderToPrint,
              dialogResult.categoriesToPrint
            );
          }
        } else {
          if (dialogResult?.ordersToArchive?.length > 0) {
            this.archiveService.archiveOrder(dialogResult.ordersToArchive);
          }
        }
      });
  }

  private createDialogConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    return dialogConfig;
  }
}
