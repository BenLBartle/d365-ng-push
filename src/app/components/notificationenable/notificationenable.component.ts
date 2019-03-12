import { Component } from '@angular/core';
import { MessagingService } from '../../shared/messaging.service';

@Component({
    selector: 'notificationenable-component',
    templateUrl: './notificationenable.component.html'
})

export class NotificationEnableComponent {
    constructor(private messagingService: MessagingService) { }

    enableSubscription() {
        const userId = 'user001';
        this.messagingService.requestPermission(userId);
        this.messagingService.receiveMessage();
        console.log(this.messagingService.currentMessage);
    }
}