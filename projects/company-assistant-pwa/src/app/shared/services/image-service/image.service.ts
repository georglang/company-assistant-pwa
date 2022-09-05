import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from '@angular/fire/compat/storage';
import { last, mergeMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

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
    const task = this.storage.upload(filePath, event.target.files[0]);

    task.percentageChanges().subscribe((percentage) => {
      this.changeImageUploadProgress(percentage);
    });

    return task.snapshotChanges().pipe(
      last(),
      mergeMap(() => {
        const url = fileRef.getDownloadURL();
        return url;
      })
    );
  }

  private changeImageUploadProgress(percentage: number): void {
    this.uploadProgressSource.next(percentage);
  }

  private uploadProgressSource = new BehaviorSubject<number>(0);
  changePercentage$ = this.uploadProgressSource.asObservable();
}
