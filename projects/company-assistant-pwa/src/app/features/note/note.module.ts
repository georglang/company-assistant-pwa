import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteRoutingModule } from './note-routing.module';
import { NotesListComponent } from './notes-list/notes-list.component';
import { AngularMaterialModule } from '../../shared/material/angular-material.module';

@NgModule({
  imports: [CommonModule, AngularMaterialModule, NoteRoutingModule],
  declarations: [NotesListComponent]
})
export class NoteModule {}
