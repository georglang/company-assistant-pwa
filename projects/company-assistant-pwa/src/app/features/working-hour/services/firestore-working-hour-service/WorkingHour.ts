import { Timestamp } from '@firebase/firestore-types';

export interface IWorkingHour {
  date: Timestamp;
  description: string;
  workingHours: number;
  id?: string; // is necessary when deleting local working hour after synchronization
  orderId?: string;
  hasBeenPrinted?: boolean;
}

export class WorkingHour implements IWorkingHour {
  public date: Timestamp;
  public description: string;
  public workingHours: number;
  public location: string;
  public id: string;
  public orderId: any;
  public hasBeenPrinted: boolean;

  constructor(
    date: Timestamp,
    description: string,
    workingHours: number,
    id?: string,
    orderId?: string,
    hasBeenPrinted?: boolean
  ) {
    this.date = date;
    this.description = description;
    this.workingHours = workingHours;
    this.id = id;
    this.orderId = orderId;
    this.hasBeenPrinted = hasBeenPrinted;
  }
}
