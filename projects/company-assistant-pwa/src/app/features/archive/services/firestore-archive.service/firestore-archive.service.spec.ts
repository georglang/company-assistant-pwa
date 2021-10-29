/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirestoreArchiveService } from './firestore-archive.service';

describe('Service: FirestoreArchive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreArchiveService]
    });
  });

  it('should ...', inject([FirestoreArchiveService], (service: FirestoreArchiveService) => {
    expect(service).toBeTruthy();
  }));
});
