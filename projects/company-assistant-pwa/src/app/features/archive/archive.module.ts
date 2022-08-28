import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveOrderlistComponent } from './archive-order-list.component';
import { ArchiveRoutingModule } from './archive.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SharedModule, ArchiveRoutingModule, FormsModule],
  declarations: [ArchiveOrderlistComponent]
})
export class ArchiveModule {}
