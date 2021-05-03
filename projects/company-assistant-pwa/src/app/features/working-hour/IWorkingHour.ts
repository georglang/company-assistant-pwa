import { Timestamp } from '@firebase/firestore-types';

export interface IWorkingHour {
  date: Timestamp;
  description: string;
  employee: string;
  workingHours: number;
  id?: string; // is necessary when deleting local working hour after synchronization
  orderId?: string;
  hasBeenPrinted?: boolean;
}
