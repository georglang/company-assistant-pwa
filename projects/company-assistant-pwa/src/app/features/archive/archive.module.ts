import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveOrderlistComponent } from './archive-order-list.component';
import { ArchiveRoutingModule } from './archive.routing.module';

@NgModule({
  imports: [CommonModule, ArchiveRoutingModule],
  declarations: [ArchiveOrderlistComponent]
})
export class ArchiveModule {}
