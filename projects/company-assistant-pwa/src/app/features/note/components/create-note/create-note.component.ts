import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IOrder } from '../../../order/Order';
import { FirestoreOrderService } from '../../../order/services/firestore-order-service/firestore-order.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {
  createNoteFormGroup: FormGroup;
  order: IOrder;
  paramOrderId;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private firestoreOrderService: FirestoreOrderService
  ) {}

  ngOnInit() {
    this.createNoteFormGroup = this.fb.group({
      note: ['', Validators.required]
    });

    this.route.params.subscribe((params) => {
      this.paramOrderId = params['id'];
      this.getOrderByIdFromCloudDatabase(this.paramOrderId);
    });
  }

  public navigateToOrderList(): void {
    this.location.back();
  }

  private getOrderByIdFromCloudDatabase(orderId: string) {
    this.firestoreOrderService.getOrderById(orderId).then((order: IOrder) => {
      if (order !== undefined) {
        this.order = order;
      }
    });
  }
}
