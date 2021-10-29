import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { IOrder } from '../Order';
import { FirestoreOrderService } from '../services/firestore-order-service/firestore-order.service';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { SearchService } from '../../../shared/services/search.service';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @ViewChild('searchbar') searchbar: ElementRef;
  @ViewChild('orderList') orderList: MatSelectionList;

  displayedColumns = ['date', 'customer', 'location'];
  highlighted: SelectionModel<IOrder>;
  selectedOrder: IOrder;
  showButtonsIfOrderIsSelected = false;
  showDeleteButton = true;
  list: IOrder[] = [];
  selectedOptions: IOrder[] = [];
  searchText: string;
  toggleSearch = false;
  subNavTitle = 'Aufträge';
  enableSubNavBackBtn = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private firestoreOrderService: FirestoreOrderService,
    private messageService: MessageService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.highlighted = new SelectionModel<IOrder>(false, []);
    this.getOrders();
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
