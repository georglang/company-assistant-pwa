import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { IOrder } from '../Order';
import { FirestoreOrderService } from '../services/firestore-order-service/firestore-order.service';
import { ConfirmDeleteDialogComponent } from '../../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { SettingsDialogComponent } from '../../../shared/components/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  public dataSource: MatTableDataSource<IOrder>;
  public displayedColumns = ['date', 'customer', 'location'];
  public highlighted: SelectionModel<IOrder>;
  public selectedOrder: IOrder;
  public showButtonsIfOrderIsSelected = false;
  public showDeleteButton = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private firestoreOrderService: FirestoreOrderService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<IOrder>();
    this.highlighted = new SelectionModel<IOrder>(false, []);
    this.getOrdersFromCloudDatabase();
  }

  public applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLocaleLowerCase();
    this.dataSource.filter = filterValue;
  }

  public deleteOrder(order: IOrder) {
    this.openDeleteOrderDialog(order.id);
  }

  private deleteOrderInFirebase(orderId: string) {
    this.firestoreOrderService.deleteOrder(orderId).then((data) => {
      this.showDeleteMessage();
      this.getOrdersFromCloudDatabase();
    });
  }

  public editOrder(order: IOrder) {
    this.router.navigate(['orders/edit-order/' + order.id]);
  }

  public getOrdersFromCloudDatabase(): void {
    if (this.firestoreOrderService !== undefined) {
      this.firestoreOrderService
        .getOrdersFromOrdersCollection2()
        .subscribe((orders: IOrder[]) => {
          if (orders !== undefined) {
            const ordersSortedByDate = orders.sort(
              (a, b) => b.date.seconds - a.date.seconds
            );
            this.dataSource = new MatTableDataSource(ordersSortedByDate);
          } else {
            this.dataSource = new MatTableDataSource();
          }
        });
    }
  }

  public navigateToOrder(order: IOrder): void {
    this.router.navigate(['orders/order-details/' + order.id]);
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

  public openSettingsDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(SettingsDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((shouldPrint) => {
      if (shouldPrint) {
        this.showDeleteButton = true;
      }
    });
  }

  public showActionButtons(selectedOrder: IOrder) {
    this.selectedOrder = selectedOrder;
    if (this.highlighted.selected.length == 0) {
      this.showButtonsIfOrderIsSelected = false;
    } else {
      this.showButtonsIfOrderIsSelected = true;
    }
  }

  private showDeleteMessage() {
    this.messageService.deletedSucessfull();
  }
}
