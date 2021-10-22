import { INote } from './INote';

export class Note implements INote {
  id?: string;
  notice?: string;
  noteId: string;
  imageUrl?: string;
  orderId: string;

  constructor(
    orderId: string,
    notice?: string,
    imageUrl?: string,
    noteId?: string
  ) {
    this.notice = notice;
    this.imageUrl = imageUrl;
    this.orderId = orderId;
    this.noteId = noteId;
  }
}
