import { Timestamp } from '@firebase/firestore-types';
import { IWorkingHour } from '../working-hour/IWorkingHour';
import { INote } from '../note/INote';
import { IMaterial } from '../material/material-list/IMaterial';
import { materials } from '../material/material-list/materials';

export interface IOrder {
  companyName: string;
  contactPerson: string;
  date: Timestamp;
  location: string;
  id?: any;
  workingHours?: IWorkingHour[];
  notes?: INote[];
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
  public id?: string;
  public workingHours?: IWorkingHour[];
  public materials?: IMaterial[];
  public notes?: INote[];

  constructor(
    date: Timestamp,
    companyName: string,
    contactPerson: string,
    location: string,
    id?: string,
    workingHours: IWorkingHour[] = [],
    materials: IMaterial[] = [],
    notes: INote[] = []
  ) {
    this.companyName = companyName;
    this.contactPerson = contactPerson;
    this.date = date;
    this.id = id;
    this.location = location;
    this.workingHours = workingHours;
    this.materials = materials;
    this.notes = notes;
  }
}
