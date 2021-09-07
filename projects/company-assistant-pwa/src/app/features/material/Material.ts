import { IMaterial } from './material-list/IMaterial';

export class Material implements IMaterial {
  public amount: number;
  public id: string;
  public material: string;
  public unit: string;
  public orderId: string;

  constructor(
    material: string,
    amount: number,
    unit: string,
    orderId?: string,
    id?: string
  ) {
    this.material = material;
    this.amount = amount;
    this.unit = unit;
    this.orderId = orderId;
    this.id = id;
  }
}
