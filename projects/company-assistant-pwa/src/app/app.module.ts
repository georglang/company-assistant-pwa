import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {
  AngularFireFunctionsModule,
  USE_EMULATOR
} from '@angular/fire/functions';

/* NgRx*/
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { environment } from '../environments/environment.prod';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app/app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { reducers, metaReducers } from './state/app.state';
import { AuthEffects } from './core/auth/state/auth.effects';

import { AuthService } from './core/auth/auth.service';
import { SignInComponent } from './core/auth/sign-in/sign-in.component';
import { SignUpComponent } from './core/auth/sign-up/sign-up.component';
import { ForgotpasswordComponent } from './core/auth/forgot-password/forgot-password.component';
import { firebaseConfig } from './firebaseConfig';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ImpressumComponent } from './shared/components/impressum/impressum.component';
import { AngularMaterialModule } from './shared/material/angular-material.module';
import { PrintDialogComponent } from './shared/components/print-dialog/print-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ForgotpasswordComponent,
    ImpressumComponent,
    PrintDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    // Init Firestore
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    // Auth
    AngularFireAuthModule,
    AngularFirestoreModule,
    // Firestorage
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    // NgRx
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      name: 'company-assistant-pwa App DevTools',
      maxAge: 25,
      logOnly: environment.production
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],

  //ngrx
  providers: [
    AuthService,

    // { provide: USE_EMULATOR, useValue: ['localhost', 5000] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
