import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkingHourRoutingModule } from './working-hour-routing.module';
import { WorkingHourListComponent } from './services/firestore-working-hour-service/working-hour-list/working-hour-list.component';

@NgModule({
  imports: [CommonModule, WorkingHourRoutingModule],
  declarations: [WorkingHourListComponent]
})
export class WorkingHourModule {}
