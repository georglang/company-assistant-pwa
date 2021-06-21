import { IRoles } from './roles';
export interface IUser {
  displayName: string;
  email: string;
  emailVerified?: boolean;
  photoUrl?: string;
  roles: IRoles;
  uid: string;
}

export class User implements IUser {
  displayName: string;
  email: string;
  emailVerified: boolean;
  photoUrl: string;
  roles: IRoles;
  uid: string;

  constructor(
    displayName: string,
    email: string,
    emailVerified: boolean,
    photoUrl: string,
    roles: IRoles,
    uid: string
  ) {
    this.displayName = displayName;
    this.email = email;
    this.emailVerified = emailVerified;
    this.photoUrl = photoUrl;
    this.roles = roles;
    this.uid = uid;
  }
}
