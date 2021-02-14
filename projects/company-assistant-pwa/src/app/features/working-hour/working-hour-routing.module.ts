import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkingHourListComponent } from './services/firestore-working-hour-service/working-hour-list/working-hour-list.component';

WorkingHourListComponent;
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: WorkingHourListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkingHourRoutingModule {}
