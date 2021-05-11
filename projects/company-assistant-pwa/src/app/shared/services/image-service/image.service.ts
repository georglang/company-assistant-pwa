import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from '@angular/fire/storage';

import { finalize, last, map, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  constructor(private storage: AngularFireStorage) {}

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    const filePath = `/images/${id}_${new Date().getTime()}_${
      event.target.files[0].name
    }`;
    const fileRef = this.storage.ref(filePath);

    return this.storage
      .upload(filePath, event.target.files[0])
      .snapshotChanges()
      .pipe(
        last(),
        mergeMap(() => {
          const url = fileRef.getDownloadURL();
          console.log('download url is ', url);
          return url;
        })
      );
  }
}
