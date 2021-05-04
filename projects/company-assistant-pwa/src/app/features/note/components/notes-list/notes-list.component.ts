import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { IOrder } from '../../../order/Order';
import { FirestoreOrderService } from '../../../order/services/firestore-order-service/firestore-order.service';
import { ITabItem } from '../../../order/lazy-loaded-tab-navigation/ITabItem';
import { tabs } from '../../../order/lazy-loaded-tab-navigation/TabData';
import { FirestoreNoteService } from '../../services/firestore-note/firestore-note.service';
import { INote } from '../../INote';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {
  dataSource = new MatTableDataSource<INote>();
  public displayedColumns = ['notice', 'image'];
  hasNotesFound: boolean = false;
  order: IOrder;
  tabsWithRoutes = [];
  tabs: ITabItem[] = tabs;
  notes: INote[] = [];
  private paramOrderId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreOrderService: FirestoreOrderService,
    private firestoreNoteService: FirestoreNoteService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.paramOrderId = params['id'];
      this.getOrderByIdFromCloudDatabase(this.paramOrderId);
      this.getNotesFromCloudDatabase(this.paramOrderId);
    });

    this.initTabNavigation();
  }

  createNote() {
    this.router.navigate(['orders/' + this.paramOrderId + '/notes/create']);
  }

  navigateToOrderList(): void {
    this.router.navigate(['/']);
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

  private getNotesFromCloudDatabase(orderId: string) {
    if (this.firestoreNoteService !== undefined) {
      this.firestoreNoteService
        .getAllNotesById(orderId)
        .subscribe((notes: INote[]) => {
          if (notes.length > 0) {
            this.setNotesDataSource(notes);
          } else {
            this.hasNotesFound = false;
          }
        });
    }
  }

  private getOrderByIdFromCloudDatabase(orderId: string) {
    this.firestoreOrderService.getOrderById(orderId).then((order: IOrder) => {
      if (order !== undefined) {
        this.order = order;
      }
    });
  }

  private setNotesDataSource(notes: INote[]) {
    console.log('NOTES: ', notes);

    this.dataSource = new MatTableDataSource<INote>(notes);
    this.notes = notes;
    this.hasNotesFound = true;
  }
}
