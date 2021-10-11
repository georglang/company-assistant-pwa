import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IOrder } from '../../../features/order/Order';
import { MatSelect } from '@angular/material/select';
import { FirestoreOrderService } from '../../../features/order/services/firestore-order-service/firestore-order.service';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit, OnDestroy {
  workingHoursChecked = true;
  notesChecked = true;
  materialsChecked = true;
  private subscriptions = new Subscription();
  private _onDestroy = new Subject<void>();
  public selectedOrder: IOrder;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  filteredOrders: ReplaySubject<IOrder[]> = new ReplaySubject<IOrder[]>(1);
  orderSelectFormControl: FormControl = new FormControl();
  orderFilteredFormControl: FormControl = new FormControl();
  orders: IOrder[] = [];

  constructor(
    private dialogRef: MatDialogRef<PrintDialogComponent>,
    private orderService: FirestoreOrderService
  ) {}

  ngOnInit(): void {
    this.getOrders();

    // listen for search field value changes
    const filterFormControlValueChanges$ = this.orderFilteredFormControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrders();
      });
    this.subscriptions.add(filterFormControlValueChanges$);

    const selectOrderValueChanges$ = this.singleSelect.valueChange.subscribe(
      (selectedOrder: IOrder) => {
        this.selectedOrder = selectedOrder;
      }
    );
    this.subscriptions.add(selectOrderValueChanges$);
  }

  private getOrders() {
    const getOrders$ = this.orderService
      .getOrdersFromOrdersCollection2()
      .subscribe((orders: IOrder[]) => {
        this.orders = orders;
        this.filteredOrders.next(this.orders.slice());
      });
    this.subscriptions.add(getOrders$);
  }

  cancle(): void {
    this.dialogRef.close({ shouldPrint: false });
  }

  closeAndSave(): void {
    this.dialogRef.close({
      shouldPrint: true,
      categoriesToPrint: {
        materials: this.materialsChecked,
        notes: this.notesChecked,
        workingHours: this.workingHoursChecked
      },
      order: this.selectedOrder
    });
  }

  private filterOrders(): void {
    if (!this.orders) {
      return;
    }
    let search: string = this.orderFilteredFormControl.value as string;
    if (!search) {
      this.filteredOrders.next(this.orders.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredOrders.next(
      this.orders.filter(
        (order) => order.companyName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions != undefined) {
      this.subscriptions.unsubscribe();
    }
  }
}
