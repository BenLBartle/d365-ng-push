import { Component, Input } from '@angular/core';
import { D365Service } from '../../shared/d365.service';
import { ConsentContext } from '../../shared/consent.context';
import { NotificationPreference } from '../../shared/notification-preference.type';
import { FormControl } from '@angular/forms';
import { truncate } from 'fs';

@Component({
    selector: 'notificationcard-component',
    templateUrl: './notificationcard.component.html',
    styleUrls: ['./notificationcard.component.css']
})
export class NotificationCardComponent {

    @Input() notificationPreference: NotificationPreference;

    constructor(private d365Service: D365Service, private consentContext: ConsentContext) {
    }

    async toggleNotification(value: string) {
        switch (this.notificationPreference.type) {
            case "OnCreate":
                await this.d365Service.notificatonCreateToggle(this.consentContext.consentUrl, this.ToBoolean(value));
                break;
            case "OnUpdate":
                await this.d365Service.notificatonUpateToggle(this.consentContext.consentUrl, this.ToBoolean(value));
                break;
            case "OnDeactivate":
                await this.d365Service.notificatonDeactivateToggle(this.consentContext.consentUrl, this.ToBoolean(value));
                break;
        }
    }

    private ToBoolean(value: string): boolean {
        if (value = 'Enabled') {
            return true;
        }
        return false;
    }
}