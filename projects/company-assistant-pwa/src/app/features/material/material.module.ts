import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialListComponent } from './material-list/material-list.component';
import { AngularMaterialModule } from '../../shared/material/angular-material.module';
import { MaterialRoutingModule } from './material-routing.module';
import { CreateMaterialComponent } from './create-material/create-material.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditMaterialComponent } from './edit-material/edit-material.component';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    MaterialRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    MaterialListComponent,
    CreateMaterialComponent,
    EditMaterialComponent
  ]
})
export class MaterialModule {}
