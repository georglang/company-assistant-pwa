import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { OrderListComponent } from './order-list/order-list.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { SettingsDialogComponent } from '../../shared/components/settings-dialog/settings-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteDialogComponent } from '../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MessageService } from '../../shared/services/message-service/message.service';
import { AngularMaterialModule } from '../../shared/material/angular-material.module';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { LazyLoadedTabNavigationComponent } from './lazy-loaded-tab-navigation/lazy-loaded-tab-navigation.component';
import { WorkingHourModule } from '../working-hour/working-hour.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    WorkingHourModule
  ],
  declarations: [
    OrderListComponent,
    OrderDetailComponent,
    CreateOrderComponent,
    EditOrderComponent,
    SettingsDialogComponent,
    ConfirmDeleteDialogComponent,
    SettingsDialogComponent,
    LazyLoadedTabNavigationComponent
  ],
  providers: [MessageService]
})
export class OrderModule {}
