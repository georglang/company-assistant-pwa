import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

/* NgRx*/
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { OAuthModule } from 'angular-oauth2-oidc';

import { environment } from '../environments/environment.prod';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app/app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './features/home/home.component';

import { reducers, metaReducers } from './state/app.state';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './core/auth/state/auth.effects';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,

    // OAuth
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [''],
        sendAccessToken: true
      }
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      name: 'angular-starter App DevTools',
      maxAge: 25,
      logOnly: environment.production
    })
  ],

  //ngrx
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
