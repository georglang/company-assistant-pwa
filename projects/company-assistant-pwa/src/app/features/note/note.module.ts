import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteRoutingModule } from './note-routing.module';
import { AngularMaterialModule } from '../../shared/material/angular-material.module';
import { CreateNoteComponent } from './components/create-note/create-note.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { EditNoteComponent } from './components/edit-note/edit-note.component';
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    NoteRoutingModule,
    CrystalLightboxModule
  ],
  declarations: [NotesListComponent, EditNoteComponent, CreateNoteComponent]
})
export class NoteModule {}
