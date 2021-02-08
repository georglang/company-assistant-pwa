import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { CreateOrderComponent } from './create-order/create-order.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent
  },
  {
    path: 'order-details/:id',
    component: OrderDetailComponent
  },
  {
    path: 'edit-order',
    component: EditOrderComponent
  },
  {
    path: 'create-order',
    component: CreateOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
