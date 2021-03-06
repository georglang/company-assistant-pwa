import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkingHourListComponent } from './working-hour-list/working-hour-list.component';
import { CreateWorkingHourComponent } from './create-working-hour/create-working-hour.component';
import { EditWorkingHourComponent } from './edit-working-hour/edit-working-hour.component';

WorkingHourListComponent;
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WorkingHourListComponent
  },
  {
    path: 'create',
    component: CreateWorkingHourComponent
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        component: EditWorkingHourComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkingHourRoutingModule {}
