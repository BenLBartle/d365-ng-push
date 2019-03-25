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

    const preference = new NotificationPreference();
    preference.title = 'New Record';
    preference.type = 'OnCreate';
    preference.description = 'Display a notification when someone creates a new record and assigns it to you';

    const preference2 = new NotificationPreference();
    preference2.title = 'Changed Record';
    preference2.type = 'OnUpdate';
    preference2.description = 'Display a notification when someone updates a record which is assigned to you';

    const preference3 = new NotificationPreference();
    preference3.title = 'Closed Record';
    preference3.type = 'OnDeactivate';
    preference3.description = 'Display a notification when someone deactivates a record which is assigned to you';

    this.notificationPreferences.push(preference, preference2, preference3);
  }
}
