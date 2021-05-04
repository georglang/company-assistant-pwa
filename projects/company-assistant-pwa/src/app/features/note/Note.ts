import { INote } from './INote';

export class Note implements INote {
  notice?: string;
  imageUrl: string;
  orderId: string;

  constructor(notice: string, imageUrl: string, orderId: string) {
    this.notice = notice;
    this.imageUrl = imageUrl;
    this.orderId = orderId;
  }
}
