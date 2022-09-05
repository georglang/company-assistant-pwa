import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/compat/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { IOrder } from '../../../order/Order';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IWorkingHour } from '../../../working-hour/IWorkingHour';
import { IMaterial } from '../../../material/material-list/IMaterial';
import { INote } from '../../../note/INote';

import { FirestoreWorkingHourService } from '../../../working-hour/services/firestore-working-hour-service/firestore-working-hour.service';
import { FirestoreMaterialService } from '../../../material/services/firestore-material-service/firestore-material.service';
import { FirestoreNoteService } from '../../../note/services/firestore-note/firestore-note.service';
import { MessageService } from 'projects/company-assistant-pwa/src/app/shared/services/message-service/message.service';
import { FirestoreOrderService } from '../../../order/services/firestore-order-service/firestore-order.service';
@Injectable({
  providedIn: 'root'
})
export class FirestoreArchiveService {
  private archiveCollection: AngularFirestoreCollection<IOrder>;
  private ordersCollection: AngularFirestoreCollection<IOrder>;

  constructor(
    private firestore: AngularFirestore,
    private readonly workingHourService: FirestoreWorkingHourService,
    private readonly materialService: FirestoreMaterialService,
    private readonly notesService: FirestoreNoteService,
    private readonly messageService: MessageService,
    private readonly firestoreOrderService: FirestoreOrderService
  ) {
    this.archiveCollection = this.firestore.collection<IOrder>('archive');
    this.ordersCollection = this.firestore.collection<IOrder>('orders');
  }

  async getOrdersWithSubcollections(): Promise<IOrder[]> {
    return new Promise((resolve) => {
      this.ordersCollection
        .snapshotChanges()
        .pipe(map((actions) => actions.map(this.documentToDomainObject)))
        .subscribe(async (orders: IOrder[]) => {
          if (orders.length > 0) {
            const results = await Promise.all(
              orders.map(async (order) => {
                const result = await this.materialService
                  .getMaterialsByOrderId(order.id)
                  .pipe(take(1))
                  .toPromise();
                return result;
              })
            );
            console.log('results', results);
          }
        });
    });
  }

  getArchivedData(): Observable<IOrder[]> {
    const observable = new Observable<IOrder[]>((observer) => {
      this.archiveCollection
        .snapshotChanges()
        .pipe(map((actions) => actions.map(this.documentToDomainObject)))
        .subscribe((orders: IOrder[]) => {
          if (orders.length > 0) {
            observer.next(orders);
          }
        });
    });
    return observable;
  }

  public archiveOrder(orders: IOrder[]): void {
    let _order: IOrder;

    orders.forEach((order: IOrder) => {
      _order = order;

      this.workingHourService
        .getWorkingHoursByOrderId(order.id)
        .pipe(take(1))
        .subscribe((workingHours: IWorkingHour[]) => {
          _order.workingHours = workingHours;
          this.materialService
            .getMaterialsByOrderId(order.id)
            .pipe(take(1))
            .subscribe((materials: IMaterial[]) => {
              _order.materials = materials;
              this.notesService
                .getNotesByOrderId(order.id)
                .pipe(take(1))
                .subscribe((notes: INote[]) => {
                  _order.notes = notes;
                  this.addOrderToArchive(order)
                    .then((data) => {
                      this.deleteOrderInOrdersCollection(order.id);
                    })
                    .catch((error) => {
                      console.error(
                        '[Error]: While adding data to the archive',
                        error
                      );
                      this.messageService.orderNotArchived();
                    });
                });
            });
        });
    });
  }

  private documentToDomainObject = (dToDO) => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };

  private addOrderToArchive(order: IOrder): Promise<DocumentReference<IOrder>> {
    return this.archiveCollection.add({ ...order });
  }

  private deleteOrderInOrdersCollection(orderId: string) {
    this.firestoreOrderService.deleteOrder(orderId).then((data) => {
      this.messageService.orderArchivedSuccessfully();
    });
  }
}
