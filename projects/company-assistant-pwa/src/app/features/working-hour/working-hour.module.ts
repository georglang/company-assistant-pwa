import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkingHourRoutingModule } from './working-hour-routing.module';
import { WorkingHourListComponent } from './working-hour-list/working-hour-list.component';
import { AngularMaterialModule } from '../../shared/material/angular-material.module';
import { CreateWorkingHourComponent } from './create-working-hour/create-working-hour.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditWorkingHourComponent } from './edit-working-hour/edit-working-hour.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    WorkingHourRoutingModule
  ],
  declarations: [
    WorkingHourListComponent,
    CreateWorkingHourComponent,
    EditWorkingHourComponent
  ]
})
export class WorkingHourModule {}
