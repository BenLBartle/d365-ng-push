import { Component } from '@angular/core';
import { D365Service } from '../../shared/d365.service';
import { MessagingService } from '../../shared/messaging.service';

@Component({
    selector: 'notificationenable-component',
    templateUrl: './notificationenable.component.html'
})

export class NotificationEnableComponent {
    constructor(private messagingService: MessagingService, private d365Service: D365Service) {
        this.d365Service.getConsent('5f5217cb-b795-483e-b6b5-f4ab112a88ce');
     }

    enableSubscription() {

        const userId = 'user001';
        this.messagingService.requestPermission(userId);
        this.messagingService.receiveMessage();
        console.log(this.messagingService.currentMessage);
    }
}