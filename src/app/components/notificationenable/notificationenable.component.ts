import { Component } from '@angular/core';
import { D365Service } from '../../shared/d365.service';
import { ConsentService } from '../../shared/consent.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfigService } from '../../shared/appconfig.service';
import * as firebase from 'firebase';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

const notificationWarningMessage: string = '👍 Your consent token has been deleted, but you can disable all notifications from this site within your browser settings.'
const notificationDisabledIcon: string = 'notifications_off';
const notificationEnabledIcon: string = 'notifications_active';
const notificationDisabledText: string = 'Notifications Disabled';
const notificationEnabledText: string = 'Notifications Enabled';
const notificationDisabledTextClass: string = 'notification-disabled';
const notificationEnabledTextClass: string = 'notification-enabled';


@Component({
    selector: 'notificationenable-component',
    templateUrl: './notificationenable.component.html',
    styleUrls: ['./notificationenable.component.css']
})

export class NotificationEnableComponent {

    checked: boolean;

    toggleIcon: string = notificationDisabledIcon;

    toggleText: string = notificationDisabledText;

    toggleTextClass: string = notificationDisabledTextClass;

    constructor(private angularFireMessaging: AngularFireMessaging, private d365Service: D365Service, private consentService: ConsentService, private snackBar: MatSnackBar) {

        firebase.initializeApp(AppConfigService.settings.FCMSettings);

        this.angularFireMessaging.messaging.subscribe(
            (messaging) => {
                messaging.onMessage = messaging.onMessage.bind(messaging);
                messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
            }
        );

        this.consentService.consentChanged$.subscribe(consent => {
            this.checked = consent;
            this.setToggleState();
        })
    }

    private setToggleState() {
        if (this.checked) {
            this.toggleIcon = notificationEnabledIcon;
            this.toggleText = notificationEnabledText;
            this.toggleTextClass = notificationEnabledTextClass;
        } 
        else {
            this.toggleIcon = notificationDisabledIcon;
            this.toggleText = notificationDisabledText;
            this.toggleTextClass = notificationDisabledTextClass;
        }
    }


    public async toggle(event: MatSlideToggleChange) {
        try {
            if (event.checked) {
                this.requestPermission(this.consentService.userId);
                this.toggleIcon = notificationEnabledIcon;
            } else {
                this.d365Service.deleteConsent(this.consentService.consentUrl);
                this.consentService.resetConsent();
                this.toggleIcon = notificationDisabledIcon;
                this.snackBar.open(notificationWarningMessage, 'Dismiss', {
                    duration: 5000,
                    verticalPosition: 'top'
                });

            }
        } catch (e) {
            console.log(e);
        }

    }

    requestPermission(userId) {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                console.log(token);
                this.d365Service.createConsent(userId, token).then(consentUrl => this.consentService.consentUrl = consentUrl);
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }
}
