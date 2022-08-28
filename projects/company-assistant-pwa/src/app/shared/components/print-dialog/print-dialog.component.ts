import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IOrder } from '../../../features/order/Order';
import { MatSelect } from '@angular/material/select';
import { FirestoreOrderService } from '../../../features/order/services/firestore-order-service/firestore-order.service';

interface PrintAndArchiveDialogReturnValue {
  categoriesToPrint: {
    materials: boolean;
    notes: boolean;
    workingHours: boolean;
  };
  ordersToArchive: IOrder[];
  orderToPrint: IOrder;
  shouldPrint: boolean;
}

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit, OnDestroy {
  workingHoursChecked = true;
  notesChecked = true;
  materialsChecked = true;
  contentTemplate: TemplateRef<any>;

  private subscriptions = new Subscription();
  private _onDestroy = new Subject<void>();
  public selectedOrder: IOrder;
  public archiveSelectedOrders: IOrder[] = [];

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('archiveSingleSelect', { static: true })
  archiveSingleSelect: MatSelect;

  filteredOrders: ReplaySubject<IOrder[]> = new ReplaySubject<IOrder[]>(1);
  orderSelectFormControl: FormControl = new FormControl();
  archiveOrderSelectFormControl: FormControl = new FormControl();
  orderFilteredFormControl: FormControl = new FormControl();
  archiveOrderFilteredFormControl: FormControl = new FormControl();
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

    const archiveFilterFormControlValueChanges$ = this.archiveOrderFilteredFormControl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrders();
      });
    this.subscriptions.add(archiveFilterFormControlValueChanges$);

    const selectArchiveOrderValueChanges$ = this.archiveSingleSelect.valueChange.subscribe(
      (selectedOrders: IOrder[]) => {
        this.archiveSelectedOrders = selectedOrders;
      }
    );
    this.subscriptions.add(selectArchiveOrderValueChanges$);
  }

  private getOrders() {
    const getOrders$ = this.orderService
      .getOrdersFromOrdersCollection()
      .subscribe((orders: IOrder[]) => {
        this.orders = orders;
        this.filteredOrders.next(this.orders.slice());
      });
    this.subscriptions.add(getOrders$);
  }

  cancle(): void {
    this.dialogRef.close({ shouldPrint: false });
  }

  closeAndSavePrintDialog(): void {
    const returnValue: PrintAndArchiveDialogReturnValue = {
      categoriesToPrint: {
        materials: this.materialsChecked,
        notes: this.notesChecked,
        workingHours: this.workingHoursChecked
      },
      ordersToArchive: null,
      orderToPrint: this.selectedOrder,
      shouldPrint: true
    };
    this.dialogRef.close(returnValue);
  }

  closeAndSaveArchiveDialog(): void {
    const returnValue: PrintAndArchiveDialogReturnValue = {
      categoriesToPrint: null,
      ordersToArchive: this.archiveSelectedOrders,
      orderToPrint: null,
      shouldPrint: false
    };
    this.dialogRef.close(returnValue);
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
