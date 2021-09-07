import { employees } from '../../shared/config-data/employees';
export interface IRoles {
  admin?: boolean;
  employee?: boolean;
  userAdmin?: boolean;
}

export class Roles implements IRoles {
  admin: boolean;
  employee: boolean;
  userAdmin: boolean;

  constructor(admin: boolean, employee: boolean, userAdmin) {
    this.admin = admin;
    this.employee = employee;
    this.userAdmin = userAdmin;
  }
}
