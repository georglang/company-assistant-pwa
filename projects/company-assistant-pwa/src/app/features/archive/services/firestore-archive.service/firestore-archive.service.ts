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

  public getOrdersWithSubcollections(): Observable<any[]> {
    return this.firestoreService.colWithIds$('orders').pipe(
      mergeMap((orders: any[]) => {
        const workingHours = orders.map((order: IOrder) => {
          return this.firestoreService
            .getCollection$(`orders/${order.id as string}/workingHours`)
            .pipe(map((workingHours: IWorkingHour[]) => workingHours));
        });

        const materials = orders.map((order: IOrder) => {
          return this.firestoreService
            .getCollection$(`orders/${order.id as string}/materials`)
            .pipe(map((materials: IMaterial[]) => materials));
        });

        const notes = orders.map((order: IOrder) => {
          return this.firestoreService
            .getCollection$(`orders/${order.id as string}/notes`)
            .pipe(map((notes: INote[]) => notes));
        });

        return combineLatest([
          of(orders),
          ...workingHours,
          ...materials,
          ...notes
        ]);
      })
      // map(([orders, workingHours, materials, notes]) => {
      //   debugger;
      //   return orders.map((order: IOrder) => {
      //     order.workingHours = workingHours.find(
      //       (workingHour: IWorkingHour) => workingHour.orderId === order.id
      //     );

      //     order.materials = materials.find(
      //       (material: IMaterial) => material.orderId === order.id
      //     );

      //     order.notes = notes.find((note: INote) => note.orderId === order.id);
      //     return order;
      //   });
      // })
    );
  }

  getOrdersWithSubcollections2() {
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
              console.log('Promise.all Result:', order);
            });
          });
        }
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
