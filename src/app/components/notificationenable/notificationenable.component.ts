import { Component } from '@angular/core';
import { D365Service } from '../../shared/d365.service';
import { ConsentContext } from '../../shared/consent.context';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Component({
    selector: 'notificationenable-component',
    templateUrl: './notificationenable.component.html',
    styleUrls: ['./notificationenable.component.css']
})

export class NotificationEnableComponent {

    selectedToggle: string;

    constructor(private angularFireMessaging: AngularFireMessaging, private d365Service: D365Service, private consentContext: ConsentContext) {
        this.angularFireMessaging.messaging.subscribe(
            (messaging) => {
                messaging.onMessage = messaging.onMessage.bind(messaging);
                messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
            }
        );
    }

    ngOnInit() {
        this.d365Service.getUserId()
            .then(result => {
                this.consentContext.userId = result;
            })
            .then(() => this.d365Service.getConsent(this.consentContext.userId))
            .then(result => this.consentContext.setConsent(result))
            .then(() => {
                if (this.consentContext.consentUrl !== undefined) {
                    this.selectedToggle = 'Enabled';
                } else {
                    this.selectedToggle = 'Disabled';
                }
            })
            .then(() => {
                console.log(this.consentContext.userId);
                console.log(this.consentContext.consentUrl);
            });
    }

    public async toggleSubcription(toggleValue: string) {

        try {
            if (toggleValue === 'Enabled') {
                this.requestPermission(this.consentContext.userId);
            } else {
                this.d365Service.deleteConsent(this.consentContext.consentUrl);

                this.consentContext.onCreate = false;
                this.consentContext.onUpdate = false;
                this.consentContext.onDeactivate = false;
            }
        } catch (e) {
            console.log(e);
        }
    }

    requestPermission(userId) {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                console.log(token);
                this.d365Service.createConsent(userId, token).then(consentUrl => this.consentContext.consentUrl = consentUrl);
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }
}
