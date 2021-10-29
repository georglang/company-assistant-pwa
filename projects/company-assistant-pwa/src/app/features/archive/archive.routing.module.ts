import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArchiveOrderlistComponent } from './archive-order-list.component';

const routes: Routes = [
  {
    path: '',
    component: ArchiveOrderlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveRoutingModule {}
