import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirestoreNoteService } from '../../services/firestore-note/firestore-note.service';
import { INote } from '../../INote';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from 'projects/company-assistant-pwa/src/app/shared/services/image-service/image.service';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit, OnDestroy {
  editNoteForm: FormGroup;
  percentageImageUpload;
  imageEvent;
  subNavTitle = 'Notiz bearbeiten';
  enableSubNavBackBtn = true;
  note: INote;
  submitted = false;
  filePath: string;
  currentlySelectedImageUrl: string;
  orderId: string;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private firestoreNoteService: FirestoreNoteService,
    private toastrService: ToastrService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.editNoteForm = this.fb.group({
      notice: ['', Validators.required],
      img: [null]
    });

    this.route.parent.parent.params.subscribe((url) => {
      this.route.parent.params.subscribe((subUrl) => {
        this.getNoteByIdFromFirebase(url.id, subUrl.id);
      });
    });
  }

  imagePreview($event): void {
    const file = ($event.target as HTMLInputElement).files[0];
    this.editNoteForm.patchValue({
      img: file
    });
    this.editNoteForm.get('img').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.note.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.imageEvent = $event;
  }

  get getEditNoteFormControls() {
    return this.editNoteForm.controls;
  }

  navigateBack(): void {
    this.location.back();
  }

  saveNote(): void {
    const note = this.note;
    note.notice = this.editNoteForm.value.notice;

    if (this.imageEvent) {
      this.uploadImage().subscribe((newImageUrl: string) => {
        note.imageUrl = newImageUrl;
        this.updateNoteToFirestoreNotesTable(note);
      });
    } else {
      this.updateNoteToFirestoreNotesTable(note);
    }
  }

  private uploadImage(): Observable<string> {
    if (this.imageService !== undefined && this.imageEvent !== undefined) {
      return this.imageService.upload(this.imageEvent);
    }
  }

  private updateNoteToFirestoreNotesTable(note: INote): void {
    if (this.firestoreNoteService) {
      this.firestoreNoteService
        .updateNote(note)
        .then(() => {
          this.showUpdateMessage();
          this.navigateToNotesList();
        })
        .catch((e) => {
          console.error('Can´t update note in firebase', e);
        });
    }
  }

  private showUpdateMessage() {
    const successConfig = {
      positionClass: 'toast-bottom-center',
      timeout: 500
    };
    this.toastrService.success(
      'Erfolgreich aktualisiert',
      'Eintrag',
      successConfig
    );
  }

  navigateToNotesList(): void {
    this.location.back();
  }

  private getNoteByIdFromFirebase(orderId: string, noteId: string) {
    const getNotes$ = this.firestoreNoteService
      .getNotesByOrderId(orderId)
      .pipe(map((notes) => notes.filter((note) => note.id === noteId)))
      .subscribe((note: INote[]) => {
        this.note = note[0];
        this.setControl(note[0]);
      });
    this.subscriptions.add(getNotes$);
  }

  private setControl(note: INote): void {
    this.editNoteForm.setValue({
      notice: note.notice,
      img: this.imageEvent ?? []
    });
    this.note.imageUrl = note.imageUrl;
  }

  ngOnDestroy(): void {
    if (this.subscriptions != undefined) {
      this.subscriptions.unsubscribe();
    }
  }
}
