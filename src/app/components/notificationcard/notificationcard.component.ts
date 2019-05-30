import { Component, Input } from '@angular/core';
import { D365Service } from '../../shared/d365.service';
import { ConsentContext } from '../../shared/consent.context';
import { NotificationPreference } from '../../shared/notification-preference.type';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

const DisabledTextValue: string = "Disabled";
const EnabledTextValue: string = "Enabled";
const DisabledTextClassName: string = "text-disabled";
const EnabledTextClassName: string = "text-enabled";

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'notificationcard-component',
    templateUrl: './notificationcard.component.html',
    styleUrls: ['./notificationcard.component.css']
})
export class NotificationCardComponent {

    @Input() notificationPreference: NotificationPreference;

    enabledClass: string = DisabledTextClassName;

    enabledText: string = DisabledTextValue;

    checked: boolean;

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

    public async toggle(event: MatSlideToggleChange) {
        console.log("Toggled to: " + event.checked);
        this.enabledClass = this.ClassFromBoolean(event.checked);
        this.enabledText = this.TextFromBoolean(event.checked);
        await this.d365Service.notificationToggle(this.consentContext.consentUrl, this.notificationPreference.boundfield, event.checked);

    }

    setSelectedToggle() {
        this.setToggleForField(this.notificationPreference.boundfield);
    }

    private setToggleForField(boundField: string) {
        switch (boundField) {
            case 'bartl_adminmessages':
                this.checked = this.consentContext.adminMessages;
                break;
            case 'bartle_lowpriority':
                this.checked = this.consentContext.lowPriority;
                break;
            case 'bartl_standardpriority':
                this.checked = this.consentContext.standardPriority;
                break;
            case 'bartl_highpriority':
                this.checked = this.consentContext.highPriority;
                break;
        }
    }

    private TextFromBoolean(value: boolean): string {
        if (value === true) {
            return EnabledTextValue;
        }
        return DisabledTextValue;
    }

    private ClassFromBoolean(value: boolean): string {
        if (value === true) {
            return EnabledTextClassName;
        }
        return DisabledTextClassName;
    }
}
