import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderRoutingModule } from './order.routing';
import { SharedModule } from '../../shared/shared.module';
import { OrderListComponent } from './order-list/order-list.component';
import { SettingsDialogComponent } from '../../shared/components/settings-dialog/settings-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDeleteDialogComponent } from '../../shared/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { MessageService } from '../../shared/services/message-service/message.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OrderRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    OrderListComponent,
    SettingsDialogComponent,
    ConfirmDeleteDialogComponent
  ],
  providers: [MessageService]
})
export class OrderModule {}