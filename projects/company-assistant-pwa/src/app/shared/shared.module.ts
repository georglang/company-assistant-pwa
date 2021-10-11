import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './material/angular-material.module';
import { FilterPipe } from './pipes/filter.pipe';
import { WorkingHoursPipe } from './pipes/working-hours.pipe';
import { SubNavigationComponent } from '../app/sub-navigation/sub-navigation.component';
import { CustomerInfoWrapperComponent } from './components/customer-info-wrapper/customer-info-wrapper.component';
@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [
    FilterPipe,
    WorkingHoursPipe,
    SubNavigationComponent,
    CustomerInfoWrapperComponent
  ],
  exports: [
    AngularMaterialModule,
    FilterPipe,
    WorkingHoursPipe,
    SubNavigationComponent,
    CustomerInfoWrapperComponent
  ]
})
export class SharedModule {}
