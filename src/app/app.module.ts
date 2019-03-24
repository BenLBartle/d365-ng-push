import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule, MatList } from '@angular/material/list';
import { environment } from '../environments/environment';

import { NotificationCardComponent } from './components/notificationcard/notificationcard.component';
import { NotificationEnableComponent } from './components/notificationenable/notificationenable.component';


import { MessagingService } from './shared/messaging.service';
import { D365Service } from './shared/d365.service';
import { ConsentContext } from './shared/consent.context';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    NotificationEnableComponent,
    NotificationCardComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatListModule,
    FlexLayoutModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [MessagingService, D365Service, AsyncPipe, ConsentContext],
  bootstrap: [AppComponent]
})

export class AppModule { }
