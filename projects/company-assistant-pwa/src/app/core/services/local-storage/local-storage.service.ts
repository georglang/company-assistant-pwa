/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@angular/core';
import { ILocalStorageValue } from './ILocalStorageValue';
import { ILocalStorageState } from './ILocalStorageState';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  static loadInitialState(): any {
    return Object.keys(localStorage).reduce((state: any, storageKey) => {
      const stateKeys = storageKey
        .toLowerCase()
        .split('.')
        .map((key) =>
          key
            .split('-')
            .map((token, index) =>
              index === 0
                ? token
                : token.charAt(0).toUpperCase() + token.slice(1)
            )
            .join('')
        );
      let currentStateRef = state;
      stateKeys.forEach((key, index) => {
        if (index === stateKeys.length - 1) {
          currentStateRef[key] = JSON.parse(localStorage.getItem(storageKey));
          return;
        }
        currentStateRef[key] = currentStateRef[key] || {};
        currentStateRef = currentStateRef[key];
      });
      return state;
    }, {});
  }

  setItem(key: string, value: ILocalStorageValue): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
