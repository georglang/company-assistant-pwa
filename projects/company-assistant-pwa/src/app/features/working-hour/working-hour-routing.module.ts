import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkingHourListComponent } from './working-hour-list/working-hour-list.component';
import { CreateWorkingHourComponent } from './create-working-hour/create-working-hour.component';

WorkingHourListComponent;
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WorkingHourListComponent
  },
  {
    path: 'create-working-hour',
    component: CreateWorkingHourComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkingHourRoutingModule {}
