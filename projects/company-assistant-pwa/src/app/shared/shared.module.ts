import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from './material/angular-material.module';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [HeaderComponent],
  exports: [AngularMaterialModule, HeaderComponent]
})
export class SharedModule {}
