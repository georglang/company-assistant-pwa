import { Timestamp } from '@firebase/firestore-types';

export interface IMaterial {
  id?: string;
  material: string;
  amount: number;
  unit: string;
  orderId: string;
}

export class Material implements IMaterial {
  public material: string;
  public amount: number;
  public unit: string;
  public orderId: string;

  constructor(material: string, amount: number, unit: string, orderId: any) {
    this.material = material;
    this.amount = amount;
    this.unit = unit;
    this.orderId = orderId;
  }
}
