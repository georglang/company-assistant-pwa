import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit, OnDestroy {
  createNoteFormGroup: FormGroup;
  order: IOrder;
  paramOrderId;
  percentageImageUpload;
  private imageEvent;
  private subscriptions: Subscription = new Subscription();
  subNavTitle = 'Notzi anlegen';
  enableSubNavBackBtn = true;

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

    const uploadProgress$ = this.imageService.changePercentage$.subscribe(
      (percentage) => {
        console.log('Percentage: ', percentage);

        this.percentageImageUpload = percentage;
      }
    );
    this.subscriptions.add(uploadProgress$);
  }

  fileInputOnChange($event): void {
    this.imageEvent = $event;
  }

  navigateToNotesList(): void {
    this.location.back();
  }

  saveNote(): void {
    this.createNote(
      this.createNoteFormGroup.controls.notice.value,
      this.paramOrderId
    );
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
          const note = new Note(orderId, notice, imageUrl);
          this.addNoteToFirestoreNotesTable(note);
        });
    } else {
      this.addNoteToFirestoreNotesTable(new Note(orderId, notice, ''));
    }
  }

  private addNoteToFirestoreNotesTable(note: INote): void {
    if (this.firestoreNoteService !== undefined) {
      this.firestoreNoteService
        .addNote(note)
        .then((id: string) => {
          this.messageService.noteCreatedSuccessfully();
          note.id = id;
          this.navigateToNotesList();
        })
        .catch((e) => {
          console.error('Can´t add note to firebase', e);
        });
    }
  }

  ngOnDestroy() {
    if (this.subscriptions !== undefined) {
      this.subscriptions.unsubscribe();
    }
  }
}
