import { Component } from '@angular/core';
import { NotificationPreference } from './shared/notification-preference.type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  notificationPreferences: NotificationPreference[];

  constructor() {
    this.notificationPreferences = new Array<NotificationPreference>();

    let preference = new NotificationPreference();
    preference.title = "New Record";
    preference.description = "A new record is created";

    let preference2 = new NotificationPreference();
    preference2.title = "Changed Record";
    preference2.description = "A record is updated";

    let preference3 = new NotificationPreference();
    preference3.title = "Closed Record";
    preference3.description = "A record is deactivated";

    this.notificationPreferences.push(preference, preference2, preference3);
  }
}
