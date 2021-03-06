import { Component, OnInit } from '@angular/core';
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
export class CreateOrderComponent implements OnInit {
  public createOrderForm: FormGroup;
  public columns: string[];
  public orders: any[]; // IOrder coudn´t be used because of firebase auto generated id,
  public submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dateAdapter: DateAdapter<Date>,
    private firestoreOrderService: FirestoreOrderService,
    private messageService: MessageService
  ) {
    this.columns = ['Datum', 'Firma', 'Einsatzleiter', 'Ort'];

    this.createOrderForm = this.formBuilder.group({
      date: ['', Validators.required],
      contactPerson: ['', Validators.required],
      companyName: ['', Validators.required],
      location: ['', Validators.required]
    });
    this.dateAdapter.setLocale('de');
  }

  ngOnInit() {}

  public navigateToOrderList() {
    this.router.navigate(['orders']);
  }

  public createOrder(formInput: any): void {
    const order = new Order(
      formInput.date,
      formInput.companyName,
      formInput.contactPerson,
      formInput.location,
      ''
    );
    order.workingHours = [];
    this.addOrderToFirebaseOrdersTable(order);
  }

  private addOrderToFirebaseOrdersTable(order: IOrder): void {
    if (this.firestoreOrderService !== undefined) {
      this.firestoreOrderService
        .checkIfOrderExists(order)
        .then((isAlreadyInFirestore: boolean) => {
          if (!isAlreadyInFirestore) {
            this.firestoreOrderService
              .addOrder(order)
              .then((order: IOrder) => {
                this.messageService.orderCreatedSuccessful();
                this.router.navigate(['orders']);
                // order.id = id;
              })
              .catch((e) => {
                console.error('can´t create order to firebase', e);
              });
          } else {
            this.messageService.orderAlreadyExists();
            return;
          }
        });
    }
  }

  get getFormControl() {
    return this.createOrderForm.controls;
  }

  public saveOrder() {
    this.submitted = true;
    if (this.createOrderForm.invalid) {
      return;
    } else {
      this.createOrder(this.createOrderForm.value);
    }
  }
}
