import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './material/angular-material.module';
import { FilterPipe } from './pipes/filter.pipe';
import { WorkingHoursPipe } from './pipes/working-hours.pipe';
import { SubNavigationComponent } from '../app/sub-navigation/sub-navigation.component';
@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [FilterPipe, WorkingHoursPipe, SubNavigationComponent],
  exports: [
    AngularMaterialModule,
    FilterPipe,
    WorkingHoursPipe,
    SubNavigationComponent
  ]
})
export class SharedModule {}
