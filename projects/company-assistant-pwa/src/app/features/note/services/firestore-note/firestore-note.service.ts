import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { INote } from '../../INote';
import { IOrder } from '../../../order/Order';

@Injectable({
  providedIn: 'root'
})
export class FirestoreNoteService {
  private ordersCollection: AngularFirestoreCollection<IOrder>;
  private notesCollection: AngularFirestoreCollection<INote>;

  constructor(private firestoreDb: AngularFirestore) {
    this.ordersCollection = this.firestoreDb.collection<IOrder>('orders');
    this.notesCollection = this.firestoreDb.collection<INote>('notes');
  }

  addNote(note: INote) {
    const _note = { ...note };
    return this.ordersCollection
      .doc(_note.orderId)
      .collection('notes')
      .add(_note)
      .then((docReference) => {
        return docReference.id;
      })
      .catch((error) => {
        console.error('Error adding note: ', error);
      });
  }

  getAllNotesByOrderId(orderId: string): Observable<INote[]> {
    return this.ordersCollection
      .doc(orderId)
      .collection('notes')
      .snapshotChanges()
      .pipe(map((actions) => actions.map(this.documentToDomainObject)));
  }

  getMaterialByOrderId(orderId: string): any {
    return this.ordersCollection
      .doc(orderId)
      .collection('notes')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  private documentToDomainObject = (dToDO) => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };
}
