import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialListComponent } from './material-list/material-list.component';
import { AngularMaterialModule } from '../../shared/material/angular-material.module';
import { MaterialRoutingModule } from './material-routing.module';
import { CreateMaterialComponent } from './create-material/create-material.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    MaterialRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MaterialListComponent, CreateMaterialComponent]
})
export class MaterialModule {}
