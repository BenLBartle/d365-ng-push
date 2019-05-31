import { Component } from '@angular/core';
import { D365Service } from '../../shared/d365.service';
import { ConsentContext } from '../../shared/consent.context';
import { AngularFireMessaging, AngularFireMessagingModule } from '@angular/fire/messaging';
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

    private messaging: AngularFireMessaging;

    constructor(private angularFireMessaging: AngularFireMessaging, private d365Service: D365Service, private consentContext: ConsentContext, private snackBar: MatSnackBar) {

        firebase.initializeApp(AppConfigService.settings.FCMSettings);

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
                    this.checked = true;
                    this.toggleIcon = notificationEnabledIcon;
                    this.toggleText = notificationEnabledText;
                    this.toggleTextClass = notificationEnabledTextClass;
                } else {
                    this.checked = false;
                    this.toggleIcon = notificationDisabledIcon;
                    this.toggleText = notificationDisabledText;
                    this.toggleTextClass = notificationDisabledTextClass;
                }
            })
            .then(() => {
                console.log(this.consentContext.userId);
                console.log(this.consentContext.consentUrl);
            });
    }

    public async toggle(event: MatSlideToggleChange) {
        try {
            if (event.checked) {
                this.requestPermission(this.consentContext.userId);
                this.toggleIcon = notificationEnabledIcon;
            } else {
                this.d365Service.deleteConsent(this.consentContext.consentUrl);
                this.consentContext.resetConsent();
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

    public async toggleSubcription(toggleValue: string) {

        try {
            if (toggleValue === 'Enabled') {
                this.requestPermission(this.consentContext.userId);
            } else {
                this.d365Service.deleteConsent(this.consentContext.consentUrl);
                this.consentContext.resetConsent();
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
                this.d365Service.createConsent(userId, token).then(consentUrl => this.consentContext.consentUrl = consentUrl);
            },
            (err) => {
                console.error('Unable to get permission to notify.', err);
            }
        );
    }
}
