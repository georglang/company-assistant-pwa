import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [HeaderComponent],
  exports: [MaterialModule, HeaderComponent]
})
export class SharedModule {}
