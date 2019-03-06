import { Component } from '@angular/core';
import * as firebase from 'firebase';

import 'firebase/auth';
import 'firebase/messaging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Dynamics 365 Push Notifications';

  enableSubscription() {

    var config = {
      apiKey: "AIzaSyCfZsLQtpUIYycADMlqu86L-L92p3dcqH4",
      authDomain: "dynamics365-1d209.firebaseapp.com",
      databaseURL: "https://dynamics365-1d209.firebaseio.com",
      projectId: "dynamics365-1d209",
      storageBucket: "dynamics365-1d209.appspot.com",
      messagingSenderId: "1006523280491"
    };

    firebase.initializeApp(config);

    const messaging = firebase.messaging();

    messaging.usePublicVapidKey('BHHkJxeogR62uhM8Lko7H45sQrXvUblUbhn4aBP0vRlmrwtiRFbw5xC09nZlP5r-gGq3mOs81-P3KwyN28t2UMM');

    messaging.requestPermission().then(function() {
      console.log('Notification permission granted.');
      
      const token = messaging.getToken();

      console.log(token);

    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });

  }
}
