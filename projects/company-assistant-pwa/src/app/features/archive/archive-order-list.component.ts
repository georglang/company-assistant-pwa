import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { MatSelectionList } from '@angular/material/list';
import { IOrder } from '../order/Order';
import { FirestoreOrderService } from '../order/services/firestore-order-service/firestore-order.service';
import { ConfirmDeleteDialogComponent } from '../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MessageService } from '../../shared/services/message-service/message.service';
import { SearchService } from '../../shared/services/search.service';
import { FirestoreArchiveService } from './services/firestore-archive.service/firestore-archive.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive-order-list.component.html',
  styleUrls: ['./archive-order-list.component.scss']
})
export class ArchiveOrderlistComponent implements OnInit {
  // private archivedOrders: IOrder[];
  // constructor(private archiveService: FirestoreArchiveService) {}

  // ngOnInit() {
  //   this.archiveService.getOrdersWithSubcollections().subscribe((data) => {
  //     const test = data[2].materials;
  //     const test2 = data[1].workingHours;
  //     const order = new Order(
  //       data[0][0].data.companyName,
  //       data[0][0].data.contactPerson,
  //       data[0][0].data.date,
  //       data[0][0].id,
  //       data[0][0].data.location,
  //       data[1].workingHours,
  //       data[2].materials,
  //       data[3].notes
  //     );
  //     debugger;
  //     console.log('Order: ', order);

  //     // this.archivedOrders.push({
  //     //   ...data[0],
  //     //   ...data[1].workingHour,
  //     //   ...
  //     // });
  //   });
  // }

  @ViewChild('searchbar') searchbar: ElementRef;
  @ViewChild('orderList') orderList: MatSelectionList;

  displayedColumns = ['date', 'customer', 'location'];
  displayedColumnsWorkingHours = [
    'date',
    'workingHours',
    'description',
    'location'
  ];
  highlighted: SelectionModel<IOrder>;
  selectedOrder: IOrder;
  showButtonsIfOrderIsSelected = false;
  showDeleteButton = true;
  list: IOrder[] = [];
  selectedOptions: IOrder[] = [];
  searchText: string;
  toggleSearch = false;
  subNavTitle = 'Abgeschlossen';
  enableSubNavBackBtn = false;
  panelOpenState = false;
  orders: IOrder[] = [];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private firestoreOrderService: FirestoreOrderService,
    private messageService: MessageService,
    private searchService: SearchService,
    private archiveService: FirestoreArchiveService
  ) {}

  ngOnInit(): void {
    this.highlighted = new SelectionModel<IOrder>(false, []);
    // this.getOrders();

    this.archiveService.getArchivedData().subscribe((orders: IOrder[]) => {
      this.orders = orders;
      console.log('Orders', this.orders);
    });

    this.searchService.searchText$.subscribe((searchText: string) => {
      this.searchText = searchText;
    });
  }

  public deleteOrder(order: IOrder): void {
    this.openDeleteOrderDialog(order.id);
  }

  private deleteOrderInFirebase(orderId: string) {
    this.firestoreOrderService.deleteOrder(orderId).then((data) => {
      this.showDeleteMessage();
      this.getOrders();
    });
  }

  public editOrder(order: IOrder): void {
    this.router.navigate(['orders/' + order.id + '/edit-order']);
  }

  public getOrders(): void {
    if (this.firestoreOrderService) {
      this.firestoreOrderService
        .getOrdersFromOrdersCollection()
        .subscribe((orders: IOrder[]) => {
          if (orders) {
            const ordersSortedByDate = orders.sort(
              (a, b) => b.date.seconds - a.date.seconds
            );
            this.list = ordersSortedByDate;
          }
        });
    }
  }

  public navigateToOrder(order: IOrder): void {
    this.router.navigate(['orders/' + order.id]);
  }

  public navigateToWorkingHours(order: IOrder): void {
    this.router.navigate(['orders/' + order.id + '/working-hours']);
  }

  public navigateToCreateOrder(): void {
    this.router.navigate(['orders/create-order']);
  }

  public openDeleteOrderDialog(orderId: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(
      ConfirmDeleteDialogComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (shouldDelete) {
        this.deleteOrderInFirebase(orderId);
      }
    });
  }

  public showActionButtons(newSelectedOrder: IOrder): void {
    if (this.selectedOrder === newSelectedOrder) {
      this.orderList.deselectAll();
      this.showButtonsIfOrderIsSelected = !this.showButtonsIfOrderIsSelected;
    } else {
      this.showButtonsIfOrderIsSelected = true;
    }
    this.selectedOrder = newSelectedOrder;
  }

  private showDeleteMessage() {
    this.messageService.deletedSucessfull();
  }

  openSearch(): void {
    this.toggleSearch = true;
    this.searchbar.nativeElement.focus();
  }
  searchClose(): void {
    this.searchService.changeSearchText('');
    this.toggleSearch = false;
  }
}
