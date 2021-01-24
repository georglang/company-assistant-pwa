/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { TestBed, async, inject } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('Service: LocalStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
  });

  it('should ...', inject(
    [LocalStorageService],
    (service: LocalStorageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
