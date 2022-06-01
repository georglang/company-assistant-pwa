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

  getOrdersWithSubcollections(): Promise<IOrder[]> {
    const _orders: IOrder[] = [];
    return new Promise((resolve) => {
      this.ordersCollection
        .snapshotChanges()
        .pipe(map((actions) => actions.map(this.documentToDomainObject)))
        .subscribe((orders: IOrder[]) => {
          if (orders.length > 0) {
            orders.map((order: IOrder) => {
              const orders$ = () => {
                return Promise.all([
                  this.materialService
                    .getMaterialsByOrderId(order.id)
                    .pipe(take(1))
                    .toPromise(),
                  this.workingHourService
                    .getWorkingHoursByOrderId(order.id)
                    .pipe(take(1))
                    .toPromise(),
                  this.notesService
                    .getNotesByOrderId(order.id)
                    .pipe(take(1))
                    .toPromise()
                ]);
              };

              void orders$().then((val) => {
                order.materials = val[0];
                order.workingHours = val[1];
                order.notes = val[2];
                _orders.push(order);
                console.log('Promise.all Result:', order);
                resolve(_orders);
              });
              console.log('11111');

              resolve(_orders);
            });
            console.log('22222');
            resolve(_orders);
          }
          console.log('33333');
          resolve(_orders);
        });
      console.log('4444');
      resolve(_orders);
    });
    console.log('5555');
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

  private documentToDomainObject = (dToDO) => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };

  public addOrderToArchive(order: IOrder): Promise<DocumentReference<IOrder>> {
    const _order = { ...order };
    return this.archiveCollection.add(_order);
  }
}
