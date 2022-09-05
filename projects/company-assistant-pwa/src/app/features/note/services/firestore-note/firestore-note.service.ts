import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { INote } from '../../INote';
import { IOrder } from '../../../order/Order';
import _ from 'lodash';
import { Note } from '../../Note';

@Injectable({
  providedIn: 'root'
})
export class FirestoreNoteService {
  private ordersCollection: AngularFirestoreCollection<IOrder>;
  private notesCollection: AngularFirestoreCollection<INote>;

  constructor(private firestore: AngularFirestore) {
    this.ordersCollection = this.firestore.collection<IOrder>('orders');
    this.notesCollection = this.firestore.collection<INote>('notes');
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

  public getNotesByOrderId(orderId: string): Observable<INote[]> {
    return this.ordersCollection
      .doc(orderId)
      .collection('notes')
      .snapshotChanges()
      .pipe(map((actions) => actions.map(this.documentToDomainObject)));
  }

  public getNotesFromNotesCollectionTest(orderId): Promise<any> {
    const notes: INote[] = [];
    return new Promise((resolve, reject) => {
      this.notesCollection.ref.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Note;
          if (data.orderId === orderId) {
            notes.push(data);
          }
        });
        resolve(notes);
      });
    });
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

  public deleteNote(orderId: string, id: string) {
    return this.ordersCollection
      .doc(orderId)
      .collection('notes')
      .doc(id)
      .delete();
  }

  public checkIfNoteExistsInOrderInFirestore(note: INote): Promise<boolean> {
    let doesNoteExist = true;
    return new Promise((resolve, reject) => {
      this.getNotesFromNotesCollectionTest(note.orderId).then((notes: any) => {
        if (notes.length > 0) {
          if (this.compareIfNoteIsOnline(note, notes)) {
            doesNoteExist = true;
          } else {
            doesNoteExist = false;
          }
        } else {
          doesNoteExist = false;
        }
        resolve(doesNoteExist);
      });
      resolve(false);
    });
  }

  public updateNote(note: INote) {
    return this.ordersCollection
      .doc(note.orderId)
      .collection('notes')
      .doc(note.id)
      .update(note)
      .then((data) => {
        debugger;
      });
  }

  private compareIfNoteIsOnline(newNote: INote, notes): boolean {
    let isNoteAlreadyOnline = false;
    const notesToCompare: INote = Object();
    Object.assign(notesToCompare, newNote);
    notes.forEach((noteOnline) => {
      delete noteOnline.id;
      if (_.isEqual(noteOnline, notesToCompare)) {
        isNoteAlreadyOnline = true;
        return;
      }
    });
    return isNoteAlreadyOnline;
  }

  private documentToDomainObject = (dToDO) => {
    const object = dToDO.payload.doc.data();
    object.id = dToDO.payload.doc.id;
    return object;
  };
}
