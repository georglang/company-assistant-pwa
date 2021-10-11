import { Component, OnInit, Input } from '@angular/core';
import { IOrder } from '../../../features/order/Order';

@Component({
  selector: 'app-customer-info-wrapper',
  templateUrl: './customer-info-wrapper.component.html',
  styleUrls: ['./customer-info-wrapper.component.scss']
})
export class CustomerInfoWrapperComponent implements OnInit {
  @Input() order: IOrder;
  constructor() {}

  ngOnInit() {}
}
