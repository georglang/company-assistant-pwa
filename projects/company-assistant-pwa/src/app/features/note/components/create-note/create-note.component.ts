import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from '../../../order/Order';
import { FirestoreOrderService } from '../../../order/services/firestore-order-service/firestore-order.service';
import { Location } from '@angular/common';
import { INote } from '../../INote';
import { Note } from '../../Note';
import { ImageService } from '../../../../shared/services/image-service/image.service';
import { FirestoreNoteService } from '../../services/firestore-note/firestore-note.service';
import { MessageService } from '../../../../shared/services/message-service/message.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})
export class CreateNoteComponent implements OnInit, OnDestroy {
  createNoteForm: UntypedFormGroup;
  order: IOrder;
  paramOrderId;
  percentageImageUpload;
  subNavTitle = 'Notiz anlegen';
  enableSubNavBackBtn = true;
  imageUrl: string;
  private imageEvent;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: UntypedFormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private firestoreOrderService: FirestoreOrderService,
    private firestoreNoteService: FirestoreNoteService,
    private messageService: MessageService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.createNoteForm = this.fb.group({
      notice: ['', Validators.required],
      img: [null]
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

  private getOrderByIdFromCloudDatabase(orderId: string): void {
    this.firestoreOrderService.getOrderById(orderId).then((order: IOrder) => {
      if (order !== undefined) {
        this.order = order;
      }
    });
  }

  imagePreview($event): void {
    const file = ($event.target as HTMLInputElement).files[0];
    this.createNoteForm.patchValue({
      img: file
    });
    this.createNoteForm.get('img').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.imageEvent = $event;
  }

  navigateToNotesList(): void {
    this.location.back();
  }

  saveNote(): void {
    if (this.imageEvent) {
      this.uploadImage().subscribe((newImageUrl: string) => {
        this.imageUrl = newImageUrl;
        const note = new Note(
          this.paramOrderId,
          this.createNoteForm.controls.notice.value,
          newImageUrl,
          ''
        );
        this.addNoteToFirestoreNotesTable(note);
      });
    } else {
      const note = new Note(
        this.paramOrderId,
        this.createNoteForm.controls.notice.value,
        '',
        ''
      );
      this.addNoteToFirestoreNotesTable(note);
    }
  }

  private uploadImage(): Observable<string> {
    if (this.imageService !== undefined && this.imageEvent !== undefined) {
      return this.imageService.upload(this.imageEvent);
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

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.unsubscribe();
    }
  }
}
