import { Timestamp } from '@firebase/firestore-types';
import { IWorkingHour } from './IWorkingHour';

export class WorkingHour implements IWorkingHour {
  public date: Timestamp;
  public description: string;
  public employee: string;
  public workingHours: number;
  public location: string;
  public id: string;
  public orderId: any;

  constructor(
    date: Timestamp,
    description: string,
    employee: string,
    workingHours: number,
    id?: string,
    orderId?: string
  ) {
    this.date = date;
    this.description = description;
    this.employee = employee;
    this.workingHours = workingHours;
    this.id = id;
    this.orderId = orderId;
  }
}
