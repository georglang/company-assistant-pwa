import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateNoteComponent } from './components/create-note/create-note.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { EditNoteComponent } from './components/edit-note/edit-note.component';
const routes: Routes = [
  {
    path: '',
    component: NotesListComponent
  },
  {
    path: 'create',
    component: CreateNoteComponent
  },
  {
    path: ':id',
    children: [
      {
        path: 'edit',
        component: EditNoteComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule {}
