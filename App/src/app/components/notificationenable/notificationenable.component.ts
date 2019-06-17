import { Component } from '@angular/core';
import { ConsentService } from '../../shared/consent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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

    constructor(private consentService: ConsentService, private snackBar: MatSnackBar) {

        this.consentService.consentChanged$.subscribe(consent => {
            this.checked = consent;
            this.setToggleState();
        });
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
                this.consentService.requestPermission();
                this.toggleIcon = notificationEnabledIcon;
            } else {
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
}
