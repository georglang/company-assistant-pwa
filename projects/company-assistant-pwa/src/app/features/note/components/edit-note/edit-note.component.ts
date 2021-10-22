import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirestoreNoteService } from '../../services/firestore-note/firestore-note.service';
import { Note } from '../../Note';
import { INote } from '../../INote';
import { MessageService } from '../../../../shared/services/message-service/message.service';
import { ToastrService } from 'ngx-toastr';
import { ImageService } from 'projects/company-assistant-pwa/src/app/shared/services/image-service/image.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {
  editNoteForm: FormGroup;
  percentageImageUpload;
  fileName = '';
  imageEvent;
  subNavTitle = 'Notiz bearbeiten';
  enableSubNavBackBtn = true;
  noteId: string;
  note: INote;
  submitted = false;
  filePath: string;

  currentlySelectedImageUrl: string;

  private orderId: string;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private firestoreNoteService: FirestoreNoteService,
    private messageService: MessageService,
    private toastrService: ToastrService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.editNoteForm = this.fb.group({
      notice: ['', Validators.required],
      img: [null],
      filename: ['']
    });

    this.route.parent.parent.params.subscribe((url) => {
      this.orderId = url.id;
      this.route.parent.params.subscribe((subUrl) => {
        this.noteId = subUrl.id;
        this.getNoteByIdFromFirebase(url.id, subUrl.id);
      });
    });
  }

  fileInputOnChange($event): void {
    this.fileName = $event.currentTarget.files[0].name;
    this.imageEvent = $event;
  }

  imagePreview($event) {
    const file = ($event.target as HTMLInputElement).files[0];

    this.editNoteForm.patchValue({
      img: file
    });

    this.editNoteForm.get('img').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.imageEvent = $event;
    debugger;
  }

  submit() {
    console.log(this.editNoteForm.value);
  }

  get getEditNoteFormControls() {
    return this.editNoteForm.controls;
  }

  navigateBack(): void {
    this.location.back();
  }

  // saveNote(): void {
  //   const note = new Note(this.editNoteForm.controls.notice.value);

  //   this.submitted = true;
  //   if (this.editNoteForm.invalid) {
  //     return;
  //   } else {
  //     this.checkIfNoteExistsInOrderInFirestore(note);
  //   }
  // }

  saveNote(): void {
    const note = new Note(
      this.orderId,
      this.editNoteForm.value.notice,
      this.editNoteForm.value.img
    );
    debugger;

    this.createNote(this.editNoteForm.value.notice, this.orderId);

    // this.submitted = true;
    // if (this.editNoteForm.invalid) {
    //   return;
    // } else {
    //   this.checkIfNoteExistsInOrderInFirestore(note);
    // }
  }

  private createNote(notice: string, orderId: string): void {
    if (this.imageService !== undefined && this.imageEvent !== undefined) {
      this.imageService
        .upload(this.imageEvent)
        .subscribe((imageUrl: string) => {
          const note = new Note(orderId, notice, imageUrl);
          this.updateNoteToFirestoreNotesTable(note);
        });
    } else {
      this.updateNoteToFirestoreNotesTable(new Note(orderId, notice, ''));
    }
  }

  private updateNoteToFirestoreNotesTable(note: INote): void {
    if (this.firestoreNoteService !== undefined) {
      this.firestoreNoteService
        .updateNote(this.orderId, note)
        .then((id: any) => {
          this.messageService.noteCreatedSuccessfully();
          note.id = id;
          this.navigateToNotesList();
        })
        .catch((e) => {
          console.error('Can´t add note to firebase', e);
        });
    }
  }

  private checkIfNoteExistsInOrderInFirestore(note: INote) {
    this.firestoreNoteService
      .checkIfNoteExistsInOrderInFirestore(note)
      .then((doesNoteExist) => {
        if (!doesNoteExist) {
          this.updateNoteInFirestore(this.orderId, note);
        } else {
          this.messageService.materialAlreadyExists();
        }
      });
  }

  private updateNoteInFirestore(orderId: string, note: INote): void {
    if (this.firestoreNoteService !== undefined) {
      this.setControl(note);
      this.firestoreNoteService.updateNote(orderId, note).then(() => {
        this.showUpdateMessage();
        this.navigateToNotesList();
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
    const getNoteByOrderId = this.firestoreNoteService
      .getNotesByOrderId(orderId)
      .subscribe((notes: any) => {
        const note = notes.forEach((note) => {
          debugger;
          this.note = new Note(
            (note.orderId = note.orderId),
            note.notice,
            note.imageUrl
          );
          this.setControl(note);
        });
      });
  }

  setControl(note: INote): void {
    this.editNoteForm.setValue({
      notice: note.notice
    });
  }
}
