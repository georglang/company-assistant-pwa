import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { DocumentReference } from '@firebase/firestore-types';

import { IOrder } from '../../../order/Order';
import { FirestoreService } from '../../../../shared/services/firestore-service/firestore.service';
import { switchMap, map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreArchiveService {
  private archiveCollection: AngularFirestoreCollection<IOrder>;
  constructor(
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService
  ) {
    this.archiveCollection = this.firestore.collection<IOrder>('archive');
  }

  public getOrdersWithSubcollections() {
    return this.firestoreService.colWithIds$('orders').pipe(
      switchMap((orders: any[]) => {
        const workingHours = orders.map((order: any) => {
          order.data.id = order.id;
          return this.firestoreService
            .getCollection$(`orders/${order.id}/workingHours`)
            .pipe(
              map((workingHours) =>
                Object.assign({ workingHours: workingHours })
              )
            );
        });

        const materials = orders.map((order: any) => {
          order.data.id = order.id;
          return this.firestoreService
            .getCollection$(`orders/${order.id}/materials`)
            .pipe(map((materials) => Object.assign({ materials: materials })));
        });

        const notes = orders.map((order: any) => {
          order.data.id = order.id;
          return this.firestoreService
            .getCollection$(`orders/${order.id}/notes`)
            .pipe(map((notes) => Object.assign({ notes: notes })));
        });

        return combineLatest(
          of(orders),
          ...workingHours,
          ...materials,
          ...notes
        );
      })
    );
  }

  public addOrderToArchive(order: IOrder): Promise<DocumentReference<IOrder>> {
    const _order = { ...order };
    return this.archiveCollection.add(_order);
  }
}
