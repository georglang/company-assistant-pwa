/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewAuthService } from './newAuth.service';

describe('Service: NewAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewAuthService]
    });
  });

  it('should ...', inject([NewAuthService], (service: NewAuthService) => {
    expect(service).toBeTruthy();
  }));
});
