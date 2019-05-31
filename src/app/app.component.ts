import { Component } from '@angular/core';
import { NotificationPreference } from './shared/notification-preference.type';
import { version } from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public notificationPreferences: NotificationPreference[];
  public version: string = version;

  constructor() {
    this.notificationPreferences = new Array<NotificationPreference>();

    const adminMessages = new NotificationPreference();
    adminMessages.title = 'Admin Messages';
    adminMessages.icon = 'message';
    adminMessages.boundfield = 'bartl_administratormessages';
    adminMessages.description = 'Enables notifications for messages sent to you by the system administrators';

    const lowPriority = new NotificationPreference();
    lowPriority.title = 'Low Priority';
    lowPriority.icon = 'notifications'
    lowPriority.boundfield = 'bartl_lowpriority';
    lowPriority.description = 'Enables notifications for low-priority system events';

    const standardPriority = new NotificationPreference();
    standardPriority.title = 'Standard Priority';
    standardPriority.icon = 'warning'
    standardPriority.boundfield = 'bartl_standardpriority';
    standardPriority.description = 'Enables notifications for standard-priority system events';

    const highPriority = new NotificationPreference();
    highPriority.title = 'High Priority';
    highPriority.icon = 'error'
    highPriority.boundfield = 'bartl_highpriority';
    highPriority.description = 'Enables notifications for high-priority system events';

    this.notificationPreferences.push(adminMessages, lowPriority, standardPriority, highPriority);
  }
}
