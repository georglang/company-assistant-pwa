import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesListComponent } from './notes-list/notes-list.component';
const routes: Routes = [
  {
    path: '',
    component: NotesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteRoutingModule {}
