import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './material/angular-material.module';
import { FilterPipe } from './pipes/filter.pipe';
import { WorkingHoursPipe } from './pipes/working-hours.pipe';

@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [FilterPipe, WorkingHoursPipe],
  exports: [AngularMaterialModule, FilterPipe, WorkingHoursPipe]
})
export class SharedModule {}
