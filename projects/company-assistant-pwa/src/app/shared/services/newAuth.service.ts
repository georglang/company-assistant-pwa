import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewAuthService {
  private isAuthenticatedSource = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSource.asObservable();

  userData: any;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.router.navigate(['orders']);
        this.changeIsAuthenticated(true);
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        this.changeIsAuthenticated(false);
      }
    });
  }

  login(email: string, password: string): void {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((value) => {
        this.router.navigate(['orders']);
      })
      .catch((err) => {
        console.log('Something went wrong', err.message);
      });
  }

  logout(): void {
    this.afAuth.signOut().then((data) => {
      console.log('Logout');

      this.router.navigate(['sign-in']);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
  }

  changeIsAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSource.next(isAuthenticated);
  }
}
