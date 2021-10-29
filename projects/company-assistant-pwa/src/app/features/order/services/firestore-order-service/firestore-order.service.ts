import { Injectable } from '@angular/core';

import { IOrder } from '../../Order';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable, from } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class FirestoreOrderService {
  public ordersCollection: AngularFirestoreCollection<IOrder>;
  public order: Observable<IOrder[]>;

  constructor(private firestore: AngularFirestore) {
    this.ordersCollection = this.firestore.collection<IOrder>('orders');
  }

  public getOrders(): Observable<IOrder[]> {
    const observable = new Observable<IOrder[]>((observer) => {
      this.ordersCollection
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

  public getOrderById(orderId: string): Promise<any> {
    return this.ordersCollection
      .doc(orderId)
      .ref.get()
      .then((doc) => {
        if (doc.exists) {
          const data: IOrder = Object.assign(doc.data());
          return data;
        }
      })
      .catch(function (error) {
        console.log('getOrderById: no order found', error);
      });
  }

  public getOrdersFromOrdersCollection(): Observable<IOrder[]> {
    return this.ordersCollection
      .snapshotChanges()
      .pipe(map((actions) => actions.map(this.documentToDomainObject)));
  }

  private documentToDomainObject = (dToDO) => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };

  // add order and return new created firebase id
  public addOrder(order: IOrder): Observable<IOrder> {
    const _order = { ...order };
    return from(this.ordersCollection.add(_order)).pipe(
      switchMap((docRef) =>
        this.ordersCollection.doc<IOrder>(docRef.id).valueChanges()
      ),
      take(1)
    );
  }

  public updateOrder(order: IOrder) {
    return this.ordersCollection
      .doc(order.id)
      .update(order)
      .then((data) => {});
  }

  public deleteOrder(orderId: string) {
    return this.ordersCollection.doc(orderId).delete();
  }
}
