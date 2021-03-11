import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialListComponent } from './material-list/material-list.component';
import { CreateMaterialComponent } from './create-material/create-material.component';
import { EditMaterialComponent } from './edit-material/edit-material.component';
const routes: Routes = [
  {
    path: '',
    component: MaterialListComponent
  },
  {
    path: 'create',
    component: CreateMaterialComponent
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        component: EditMaterialComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule {}
