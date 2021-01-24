/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('Service: Notification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
  });

  it('should ...', inject(
    [NotificationService],
    (service: NotificationService) => {
      expect(service).toBeTruthy();
    }
  ));
});
