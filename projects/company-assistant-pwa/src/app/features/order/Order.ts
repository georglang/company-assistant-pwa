import { Timestamp } from '@firebase/firestore-types';
import { IWorkingHour } from '../working-hour/IWorkingHour';

export interface IOrder {
  companyName: string;
  contactPerson: string;
  date: Timestamp;
  location: string;
  id?: any;
  workingHours?: IWorkingHour[];
}

export interface IFlattenOrder {
  companyName: string;
  contactPerson: string;
  location: string;
}

export class Order implements IOrder {
  public companyName: string;
  public contactPerson: string;
  public date: Timestamp;
  public location: string;
  public id?: any;
  public workingHours?: IWorkingHour[];

  constructor(
    date: Timestamp,
    companyName: string,
    contactPerson: string,
    location: string,
    id?: any,
    workingHours?: IWorkingHour[]
  ) {
    this.companyName = companyName;
    this.contactPerson = contactPerson;
    this.date = date;
    this.id = id;
    this.location = location;
    this.workingHours = workingHours;
  }
}
