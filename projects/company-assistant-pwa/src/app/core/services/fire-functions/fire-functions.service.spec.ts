/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FireFunctionsService } from './fire-functions.service';

describe('Service: FireFunctions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FireFunctionsService]
    });
  });

  it('should ...', inject([FireFunctionsService], (service: FireFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
