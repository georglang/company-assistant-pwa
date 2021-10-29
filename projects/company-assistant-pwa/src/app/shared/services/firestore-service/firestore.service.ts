import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Observable, pipe, combineLatest, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { materials } from '../../../features/material/material-list/materials';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private firestore: AngularFirestore) {}

  public add<T>(ref: CollectionPredicate<T>, data) {
    const timestamp = this.timestamp;
    return this.col(ref).add({
      ...data,
      updated_at: timestamp,
      created_at: timestamp
    });
  }

  get timestamp() {
    return firebase.default.firestore.FieldValue.serverTimestamp();
  }

  getCollection() {}

  /// **************
  /// Get a Reference
  /// **************
  public col<T>(
    ref: CollectionPredicate<T>,
    queryFn?
  ): AngularFirestoreCollection<T> {
    return typeof ref === 'string'
      ? this.firestore.collection<T>(ref, queryFn)
      : ref;
  }

  public doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.firestore.doc<T>(ref) : ref;
  }

  public getCollection$<T>(
    ref: CollectionPredicate<T>,
    queryFn?
  ): Observable<T[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((docs) => {
          return docs.map((a) => a.payload.doc.data()) as T[];
        })
      );
  }

  /// with Ids
  public colWithIds$<T>(
    ref: CollectionPredicate<T>,
    queryFn?
  ): Observable<any[]> {
    return this.col(ref, queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  public getDocWithIds<T>(ref: DocPredicate<T>): Observable<any> {
    return this.doc(ref)
      .snapshotChanges()
      .pipe(
        map((a) => {
          // return actions.map(a => {

          // });
          const data = a.payload.data();
          const id = a.payload.id;
          return { id, ...data };
        })
      );
  }
}
