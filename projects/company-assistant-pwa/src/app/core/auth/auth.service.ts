import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn$: Observable<boolean>;
  private isLoggedInSubject: Subject<boolean>;

  constructor() {
    this.isLoggedInSubject = new Subject<boolean>();
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  login(): void {}

  logout(): void {}

  hasValidAccessToken(): boolean {
    return true;
  }
}
