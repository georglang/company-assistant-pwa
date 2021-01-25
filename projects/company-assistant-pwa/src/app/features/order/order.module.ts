import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order.routing';
import { SharedModule } from '../../shared/shared.module';
import { OrderListComponent } from './orderList/OrderList.component';

@NgModule({
  imports: [CommonModule, SharedModule, OrderRoutingModule],
  declarations: [OrderListComponent]
})
export class OrderModule {}
