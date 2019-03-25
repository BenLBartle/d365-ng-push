import { Component, Input } from '@angular/core';
import { D365Service } from '../../shared/d365.service';
import { ConsentContext } from '../../shared/consent.context';
import { NotificationPreference } from '../../shared/notification-preference.type';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'notificationcard-component',
    templateUrl: './notificationcard.component.html',
    styleUrls: ['./notificationcard.component.css']
})
export class NotificationCardComponent {

    @Input() notificationPreference: NotificationPreference;

    selectedToggle: string;

    constructor(private d365Service: D365Service, private consentContext: ConsentContext) {
    }

    ngOnInit() {

        this.d365Service.getUserId()
            .then(result => {
                this.consentContext.userId = result;
            })
            .then(() => this.d365Service.getConsent(this.consentContext.userId))
            .then(result => {
                this.consentContext.setConsent(result);
            })
            .then(() => {
                this.setSelectedToggle();
            });

    }

    async toggleNotification(value: string) {
        switch (this.notificationPreference.type) {
            case 'OnCreate':
                await this.d365Service.notificatonCreateToggle(this.consentContext.consentUrl, this.ToBoolean(value));
                break;
            case 'OnUpdate':
                await this.d365Service.notificatonUpateToggle(this.consentContext.consentUrl, this.ToBoolean(value));
                break;
            case 'OnDeactivate':
                await this.d365Service.notificatonDeactivateToggle(this.consentContext.consentUrl, this.ToBoolean(value));
                break;
        }
    }

    setSelectedToggle() {
        switch (this.notificationPreference.type) {
            case 'OnCreate':
                this.selectedToggle = this.FromBoolean(this.consentContext.onCreate);
                break;
            case 'OnUpdate':
                this.selectedToggle = this.FromBoolean(this.consentContext.onUpdate);
                break;
            case 'OnDeactivate':
                this.selectedToggle = this.FromBoolean(this.consentContext.onDeactivate);
                break;
        }
    }

    private ToBoolean(value: string): boolean {
        if (value === 'Enabled') {
            return true;
        }
        return false;
    }

    private FromBoolean(value: boolean): string {
        if (value === true) {
            return 'Enabled';
        }
        return 'Disabled';
    }
}
