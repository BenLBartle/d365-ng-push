import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { environment } from '../environments/environment';
import { MatIconModule } from '@angular/material/icon';





import { AsyncPipe } from '../../node_modules/@angular/common';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Import Components
import { NotificationCardComponent } from './components/notificationcard/notificationcard.component';
import { NotificationEnableComponent } from './components/notificationenable/notificationenable.component';

// Import Services
import { MessagingService } from './shared/messaging.service';
import { D365Service } from './shared/d365.service';
import { ConsentContext } from './shared/consent.context';
import { WindowRef } from './shared/windowref.service';
import { AppConfigService } from './shared/appconfig.service';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';


export function initializeApp(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}


@NgModule({
  declarations: [
    AppComponent,
    NotificationEnableComponent,
    NotificationCardComponent,
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    FlexLayoutModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(AppConfigService.settings.FCMSettings),
    
  ],
  providers: [MessagingService, D365Service, AsyncPipe, ConsentContext, WindowRef, AppConfigService, { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfigService], multi: true }],
  bootstrap: [AppComponent]
})

export class AppModule { }
