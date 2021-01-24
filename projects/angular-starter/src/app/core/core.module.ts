import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { authLogin, authLogout } from './auth/state/auth.actions';
import { selectIsAuthenticated, selectAuth } from './auth/state/auth.selectors';

// font awesome module
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';

import {
  faCog,
  faBars,
  faRocket,
  faPowerOff,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';

export { authLogin, authLogout, selectIsAuthenticated, selectAuth };

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, FontAwesomeModule, HttpClientModule],
  exports: [FormsModule, FontAwesomeModule]
})
export class CoreModule {
  constructor(faIconLibrary: FaIconLibrary) {
    faIconLibrary.addIcons(faCog, faBars, faRocket, faPowerOff, faUserCircle);
  }
}
