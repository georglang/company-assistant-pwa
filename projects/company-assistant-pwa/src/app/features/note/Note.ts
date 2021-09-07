import { INote } from './INote';

export class Note implements INote {
  notice?: string;
  imageUrl?: string;
  orderId: string;

  constructor(orderId: string, notice?: string, imageUrl?: string) {
    this.notice = notice;
    this.imageUrl = imageUrl;
    this.orderId = orderId;
  }
}
