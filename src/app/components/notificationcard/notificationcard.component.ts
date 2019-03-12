import { Component, Input } from '@angular/core';
import { NotificationPreference } from '../../shared/notification-preference.type';

@Component({
    selector: 'notificationcard-component',
    templateUrl: './notificationcard.component.html',
    styleUrls: ['./notificationcard.component.css']
})
export class NotificationCardComponent {

    @Input() notificationPreference: NotificationPreference;

    constructor() {
    }
}