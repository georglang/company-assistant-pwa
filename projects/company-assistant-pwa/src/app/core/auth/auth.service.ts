import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from './user';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$: Observable<boolean>;
  userData: any;
  private isLoggedInSubject: Subject<boolean>;

  constructor(
    public router: Router,
    public ngZone: NgZone, // remove outside scope warning
    public afFirestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private localStorageService: LocalStorageService
  ) {
    this.isLoggedInSubject = new Subject<boolean>();
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();

    this.afAuth.authState.subscribe((user: IUser) => {
      if (user) {
        this.isLoggedInSubject.next(true);
      } else {
        this.isLoggedInSubject.next(false);
      }
    });
  }

  login(email: string, password: string): Promise<void | AngularFireAuth> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.isLoggedInSubject.next(true);
        this.ngZone.run(() => {
          // this.router.navigate(['home']);
        });
        this.setUserData(result.user);
      })
      .catch((error) => {
        this.isLoggedInSubject.next(false);
        window.alert(error.message);
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.localStorageService.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  // sign up with email / password
  signUp(email: string, password: string): Promise<void> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
          up and returns promise */
        this.setUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  forgotPassword(passwordResetEmail): Promise<void> {
    return this.afAuth
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

  setUserData(user): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afFirestore.doc(
      `users/${user.uid}`
    );
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }
}
