import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IOrder } from '../../../order/Order';
import { FirestoreOrderService } from '../../../order/services/firestore-order-service/firestore-order.service';
import { Location } from '@angular/common';
import { INote } from '../../INote';
import { Note } from '../../Note';
import { ImageService } from '../../../../shared/services/image-service/image.service';
import { FirestoreNoteService } from '../../services/firestore-note/firestore-note.service';
import { MessageService } from '../../../../shared/services/message-service/message.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit {
  createNoteFormGroup: FormGroup;
  order: IOrder;
  paramOrderId;
  private imageEvent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private firestoreOrderService: FirestoreOrderService,
    private firestoreNoteService: FirestoreNoteService,
    private messageService: MessageService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.createNoteFormGroup = this.fb.group({
      notice: ['', Validators.required]
    });

    this.route.params.subscribe((params) => {
      this.paramOrderId = params['id'];
      this.getOrderByIdFromCloudDatabase(this.paramOrderId);
    });
  }

  fileInputOnChange($event): void {
    this.imageEvent = $event;
  }

  navigateToOrderList(): void {
    this.location.back();
  }

  saveNote(): void {
    if (this.createNoteFormGroup.invalid) {
      return;
    } else {
      this.createNote(
        this.createNoteFormGroup.controls.notice.value,
        this.paramOrderId
      );
    }
  }

  private getOrderByIdFromCloudDatabase(orderId: string): void {
    this.firestoreOrderService.getOrderById(orderId).then((order: IOrder) => {
      if (order !== undefined) {
        this.order = order;
      }
    });
  }

  private createNote(notice: string, orderId: string): void {
    if (this.imageService !== undefined && this.imageEvent !== undefined) {
      this.imageService
        .upload(this.imageEvent)
        .subscribe((imageUrl: string) => {
          const note = new Note(notice, imageUrl, orderId);
          this.addNoteToFirestoreNotesTable(note);
        });
    }
  }

  private addNoteToFirestoreNotesTable(note: INote): void {
    if (this.firestoreNoteService !== undefined) {
      this.firestoreNoteService
        .addNote(note)
        .then((id: string) => {
          this.messageService.noteCreatedSuccessfully();
          note.id = id;
        })
        .catch((e) => {
          console.error('Can´t add note to firebase', e);
        });
    }
  }
}
