import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { IOrder } from '../../../order/Order';
import { FirestoreOrderService } from '../../../order/services/firestore-order-service/firestore-order.service';
import { ITabItem } from '../../../order/lazy-loaded-tab-navigation/ITabItem';
import { tabs } from '../../../order/lazy-loaded-tab-navigation/TabData';
import { FirestoreNoteService } from '../../services/firestore-note/firestore-note.service';
import { INote } from '../../INote';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmDeleteDialogComponent } from '../../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {
  dataSource = new MatTableDataSource<INote>();
  public displayedColumns = ['notice', 'image'];
  highlighted = new SelectionModel<INote>(false, []);
  selection = new SelectionModel<INote>(true, []);
  selectedOptions: INote[] = [];

  hasNotesFound = false;
  order: IOrder;
  tabsWithRoutes = [];
  selectedNote: INote;
  showButtonsIfSelected = false;
  tabs: ITabItem[] = tabs;
  notes: INote[] = [];
  showDeleteButton = true;
  subNavTitle = 'Notizen';
  enableSubNavBackBtn = true;
  private paramOrderId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreOrderService: FirestoreOrderService,
    private firestoreNoteService: FirestoreNoteService,
    public dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.paramOrderId = params['id'];
      this.getOrderByIdFromCloudDatabase(this.paramOrderId);
      this.getNotesFromCloudDatabase(this.paramOrderId);
    });

    this.initTabNavigation();
  }

  navigateToCreateNote(): void {
    this.router.navigate(['orders/' + this.paramOrderId + '/notes/create']);
  }

  navigateToOrderList(): void {
    this.router.navigate(['/']);
  }

  public navigateToEditNote(note: INote): void {
    this.router.navigate([
      'orders/' + this.paramOrderId + '/notes/' + note.id + '/edit/'
    ]);
  }

  public showActionButtons(selectedNote: INote[]): void {
    this.selectedNote = selectedNote[0];
    if (selectedNote.length == 0) {
      this.showButtonsIfSelected = false;
    } else {
      this.showButtonsIfSelected = true;
    }
  }

  public deleteNote(note: INote): void {
    this.openDeleteNoteDialog(note.id);
  }

  private openDeleteNoteDialog(noteId: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(
      ConfirmDeleteDialogComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (shouldDelete) {
        this.deleteNoteInFirebase(noteId);
      }
    });
  }

  private deleteNoteInFirebase(noteId: string): void {
    this.firestoreNoteService
      .deleteNote(this.paramOrderId, noteId)
      .then((data) => {
        this.showDeleteMessage();
        this.getNotesFromCloudDatabase(this.paramOrderId);
      });
  }

  public getNotesFromCloudDatabase(orderId: string): void {
    if (this.firestoreNoteService !== undefined) {
      this.firestoreNoteService
        .getNotesByOrderId(orderId)
        .subscribe((notes: INote[]) => {
          // this.order.notes = notes;
          this.notes = notes;

          this.setNotesDataSource(notes);
        });
    }
  }

  public setNotesDataSource(notes: INote[]): void {
    if (notes.length > 0) {
      this.dataSource = new MatTableDataSource<INote>(notes);
      this.hasNotesFound = true;
    } else {
      this.dataSource = new MatTableDataSource<INote>();
      this.hasNotesFound = false;
    }
  }

  // private setNotesDataSource(notes: INote[]) {
  //   this.dataSource = new MatTableDataSource<INote>(notes);
  //   this.notes = notes;
  //   this.hasNotesFound = true;
  // }

  public showDeleteMessage(): void {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastrService.error('Erfolgreich gelöscht', 'Eintrag', successConfig);
  }

  private initTabNavigation() {
    tabs.forEach((tab) => {
      switch (tab.feature) {
        case 'workingHours': {
          this.tabsWithRoutes.push({
            label: tab.label,
            icon: tab.icon,
            route: '/orders/' + this.paramOrderId + '/working-hours'
          });
          break;
        }
        case 'materials': {
          this.tabsWithRoutes.push({
            label: tab.label,
            icon: tab.icon,
            route: '/orders/' + this.paramOrderId + '/material'
          });
          break;
        }
        case 'notes': {
          this.tabsWithRoutes.push({
            label: tab.label,
            icon: tab.icon,
            route: '/orders/' + this.paramOrderId + '/notes'
          });
          break;
        }
      }
    });
  }

  private getOrderByIdFromCloudDatabase(orderId: string) {
    this.firestoreOrderService.getOrderById(orderId).then((order: IOrder) => {
      if (order !== undefined) {
        this.order = order;
      }
    });
  }
}
