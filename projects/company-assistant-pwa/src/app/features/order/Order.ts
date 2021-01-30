import { Timestamp } from '@firebase/firestore-types';

export interface IOrder {
  companyName: string;
  contactPerson: string;
  date: Timestamp;
  id: any;
  location: string;
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
  public id: any;
  public location: string;

  constructor(
    date: Timestamp,
    companyName: string,
    contactPerson: string,
    id: any,
    location: string
  ) {
    this.companyName = companyName;
    this.contactPerson = contactPerson;
    this.date = date;
    this.id = id;
    this.location = location;
  }
}
