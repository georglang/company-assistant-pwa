import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class FireFunctionsService {
  public callableHelloWorld;
  public callableAddAdminRole;
  public callableAddUserAdminRole;

  constructor(private fireFunctions: AngularFireFunctions) {
    this.callableHelloWorld = this.fireFunctions.httpsCallable('helloWorld');
    this.callableAddAdminRole = this.fireFunctions.httpsCallable(
      'addAdminRole'
    );
    this.callableAddUserAdminRole = this.fireFunctions.httpsCallable(
      'addUserAdminRole'
    );
  }

  addAdminRole() {
    return this.callableAddAdminRole();
  }

  addUserAdminRole() {
    return this.callableAddUserAdminRole();
  }

  callHelloWorld() {
    // return this.callableHelloWorld();
    // Use the function name from Firebase
    const callable = this.fireFunctions.httpsCallable('helloWorld');

    // Create an Observable and pass any data you want to the function
    const obs = callable({ coolMsg: 'test' });

    obs.subscribe(async (res) => {
    });
  }
}
