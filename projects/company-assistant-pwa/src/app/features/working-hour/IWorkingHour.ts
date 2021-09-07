import { Timestamp } from '@firebase/firestore-types';

export interface IWorkingHour {
  date: Timestamp;
  description: string;
  employee: string;
  workingHours: number;
  id?: string;
  orderId?: string;
  hasBeenPrinted?: boolean;
}
