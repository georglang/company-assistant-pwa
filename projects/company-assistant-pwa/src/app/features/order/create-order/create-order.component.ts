import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

import { Order, IOrder } from '../Order';
import { FirestoreOrderService } from '../services/firestore-order-service/firestore-order.service';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { loadash as _ } from 'lodash';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent {
  createOrderForm: FormGroup;
  orders: any[]; // IOrder coudn´t be used because of firebase auto generated id,
  submitted = false;
  subNavTitle = 'Arbeitsstunden bearbeiten';
  enableSubNavBackBtn = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private firestoreOrderService: FirestoreOrderService,
    private messageService: MessageService
  ) {
    this.createOrderForm = this.formBuilder.group({
      date: ['', Validators.required],
      contactPerson: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required]
    });
    this.dateAdapter.setLocale('de');
  }

  public navigateToOrderList(): void {
    this.router.navigate(['orders']);
  }

  get getFormControl() {
    return this.createOrderForm.controls;
  }

  public saveOrder(): void {
    this.submitted = true;
    if (this.createOrderForm.invalid) {
      return;
    } else {
      this.createOrder(this.createOrderForm.value);
    }
  }

  private createOrder(formInput: any): void {
    const order = new Order(
      formInput.date,
      formInput.companyName,
      formInput.contactPerson,
      formInput.location,
      ''
    );
    order.materials = [];
    order.workingHours = [];
    order.notes = [];
    this.addOrderToFirebaseOrdersTable(order);
  }

  private addOrderToFirebaseOrdersTable(order: IOrder): void {
    if (this.firestoreOrderService) {
      this.firestoreOrderService.addOrder(order).subscribe(
        (order: IOrder) => {
          if (order) {
            this.messageService.orderCreatedSuccessful();
            this.navigateToOrderList();
          } else {
            this.messageService.orderNotCreated();
          }
        },
        (error) => {
          console.log('Error add order to firebase', error);
          this.messageService.orderNotCreated();
        }
      );
    }
  }
}
