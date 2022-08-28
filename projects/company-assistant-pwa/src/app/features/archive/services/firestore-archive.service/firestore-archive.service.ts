import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { IOrder } from '../../../order/Order';
import { FirestoreService } from '../../../../shared/services/firestore-service/firestore.service';
import { map, mergeMap, take } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { IWorkingHour } from '../../../working-hour/IWorkingHour';
import { IMaterial } from '../../../material/material-list/IMaterial';
import { INote } from '../../../note/INote';

import { FirestoreWorkingHourService } from '../../../working-hour/services/firestore-working-hour-service/firestore-working-hour.service';
import { FirestoreMaterialService } from '../../../material/services/firestore-material-service/firestore-material.service';
import { FirestoreNoteService } from '../../../note/services/firestore-note/firestore-note.service';
@Injectable({
  providedIn: 'root'
})
export class FirestoreArchiveService {
  private archiveCollection: AngularFirestoreCollection<IOrder>;
  private ordersCollection: AngularFirestoreCollection<IOrder>;

  constructor(
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService,
    private workingHourService: FirestoreWorkingHourService,
    private materialService: FirestoreMaterialService,
    private notesService: FirestoreNoteService
  ) {
    this.archiveCollection = this.firestore.collection<IOrder>('archive');
    this.ordersCollection = this.firestore.collection<IOrder>('orders');
  }

  async getOrdersWithSubcollections(): Promise<IOrder[]> {
    const _orders: IOrder[] = [];

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

  public archiveOrder(orders: IOrder[]) {
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
                  this.addOrderToArchive(order).then((data) => {
                    debugger;
                  });
                });
            });
        });

      // Zuerst Orders in archiv übertragen und wenn success callback kommt aus orders table loeschen
      // archive order http call
    });
  }

  private documentToDomainObject = (dToDO) => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };

  private addOrderToArchive(order: IOrder): Promise<DocumentReference<IOrder>> {
    const _order = { ...order };
    return this.archiveCollection.add(_order);
  }
}
