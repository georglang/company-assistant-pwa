import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IUser, User } from './user';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { IRoles, Roles } from './roles';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: AngularFireAuth = null;

  // user$: BehaviorSubject<IUser> = new BehaviorSubject(null);
  userObs$: Observable<IUser>;

  isLoggedIn$: Observable<boolean>;
  private isLoggedInSubject: Subject<boolean>;

  private userSubject$: BehaviorSubject<any> = new BehaviorSubject(null);
  public userChangedObs$ = this.userSubject$.asObservable();

  constructor(
    public router: Router,
    public ngZone: NgZone, // remove outside scope warning
    public firestore: AngularFirestore,
    public auth: AngularFireAuth,
    private localStorageService: LocalStorageService
  ) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    this.auth.authState.subscribe((auth) => {
      // if (auth) {
      //   this.authState = auth;
      // }
      // try login with user role
      // this.isLoggedInSubject.next(true);
      // return this.firestore
      //   .doc<IUser>(`users/${user.uid}`)
      //   .snapshotChanges()
      //   .pipe(
      //     map((action) => {
      //       const data = action.payload.data();
      //       const id = action.payload.id;
      //       const userFromDb = { ...data };
      //       this.changeUserState(userFromDb);
      //     })
      //   );
      // }
      // else {
      //   this.changeUserState(null);
      //   this.isLoggedInSubject.next(false);
      // }
    });
  }

  get authenticated(): boolean {
    const test = this.authState.authState;
    return test !== null;
  }

  changeUserState(user: IUser) {
    this.userSubject$.next(user);
  }

  getUserFromDb(uid: string) {
    return this.firestore
      .doc<IUser>(`users/${uid}`)
      .snapshotChanges()
      .pipe(
        map((action) => {
          const data = action.payload.data();
          const userFromDb = { ...data };
          this.changeUserState(userFromDb);
          return userFromDb;
        })
      );
  }

  login(email: string, password: string): Promise<void | AngularFireAuth> {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        // this.isLoggedInSubject.next(true);
        this.router.navigate(['orders']);
        // this.updateUserData(result.user);
      })
      .catch((error) => {
        this.isLoggedInSubject.next(false);
        // ToDo: Error Handling wrong password
        window.alert(error.message);
      });
  }

  logout(): Promise<void> {
    return this.auth.signOut().then(() => {
      debugger;
      this.localStorageService.removeItem('user');
      this.changeUserState(null);
      this.router.navigate(['sign-in']);
    });
  }

  forgotPassword(passwordResetEmail): Promise<void> {
    return this.auth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'password reset email gesendet, schau in dein Email Postfach.'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  signUp(email: string, password: string, roles: IRoles, displayName: string) {
    debugger;
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // this.sendVerificationMail().then((data) => {
        //   debugger;
        // });
        this.updateUserData(result.user, roles, displayName);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  updateUserData(firebaseUser, roles?: IRoles, displayName?: string) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(
      `users/${firebaseUser.uid}`
    );

    this.firestore
      .doc<IUser>(`users/${firebaseUser.uid}`)
      .snapshotChanges()
      .pipe(
        map((action) => {
          const data = action.payload.data();
          return { ...data };
        })
      )
      .subscribe((firebaseUserDb) => {
        if (this.isEmptyObject(firebaseUserDb)) {
          debugger;
          this.createNewUserInDB(userRef, firebaseUser, roles, displayName);
        } else if (!firebaseUserDb.roles) {
          const rolesNoCustomObject = {
            admin: firebaseUserDb.roles.admin,
            employee: firebaseUserDb.roles.employee,
            userAdmin: firebaseUserDb.roles.userAdmin
          };

          const newUser: IUser = {
            uid: firebaseUserDb.uid,
            email: firebaseUserDb.email,
            displayName: firebaseUserDb.displayName,
            emailVerified: firebaseUserDb.emailVerified,
            photoUrl: '',
            roles: rolesNoCustomObject
          };
          this.changeUserState(firebaseUserDb);
          userRef.set(newUser, {
            merge: true
          });
        }
      });
  }

  createNewUserInDB(
    userDbRef: AngularFirestoreDocument<any>,
    firebaseUser,
    roles,
    displayName
  ) {
    const rolesNoCustomObject = {
      admin: roles.admin,
      employee: roles.employee,
      userAdmin: roles.userAdmin
    };

    const newUser: IUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: displayName,
      emailVerified: firebaseUser.emailVerified,
      photoUrl: '',
      roles: rolesNoCustomObject
    };
    this.changeUserState(newUser);
    userDbRef.set(newUser, {
      merge: true
    });
  }

  // Send email verfificaiton when new user sign up
  private async sendVerificationMail() {
    (await this.auth.currentUser).sendEmailVerification().then(() => {
      alert('Email sent');
    });
  }

  isAdmin(user: any) {
    const allowedRoles = ['admin'];
    return this.checkAuthorization(user, allowedRoles);
  }

  canCreate(user: IUser): boolean {
    const allowedRoles = ['userAdmin'];
    return this.checkAuthorization(user, allowedRoles);
  }

  canRead(user: IUser): boolean {
    const allowedRoles = ['admin', 'userAdmin', 'employee'];
    return this.checkAuthorization(user, allowedRoles);
  }

  canUpdate(user: IUser): boolean {
    const allowedRoles = ['userAdmin', 'employee'];
    return this.checkAuthorization(user, allowedRoles);
  }

  canDelete(user: IUser): boolean {
    const allowedRoles = ['userAdmin'];
    return this.checkAuthorization(user, allowedRoles);
  }

  private checkAuthorization(user: IUser, allowedRoles: string[]): boolean {
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

  private isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
}
