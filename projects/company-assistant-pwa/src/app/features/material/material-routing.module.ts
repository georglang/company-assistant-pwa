import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialListComponent } from './material-list/material-list.component';
import { CreateMaterialComponent } from './create-material/create-material.component';
const routes: Routes = [
  {
    path: '',
    component: MaterialListComponent
  },
  {
    path: 'create',
    component: CreateMaterialComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule {}
