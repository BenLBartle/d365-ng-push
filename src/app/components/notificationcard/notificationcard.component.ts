import { Component, Input } from '@angular/core';
import { ConsentService } from '../../shared/consent.service';
import { NotificationPreference } from '../../shared/notification-preference.type';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { filter } from 'rxjs/operators';

const DisabledTextValue: string = "Disabled";
const EnabledTextValue: string = "Enabled";
const DisabledTextClassName: string = "text-disabled";
const EnabledTextClassName: string = "text-enabled";
const CardEnabledClassName: string = "notification-card";
const CardDisabledClassName: string = "notification-card-disabled"

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

    checked: boolean = false;

    enabled: boolean = false;

    cardclass: string = CardDisabledClassName;

    constructor(private consentService: ConsentService) {
        this.consentService.permissionChanged$
            .pipe(filter(p => p.boundfield == this.notificationPreference.boundfield))
            .subscribe(p => {
                this.checked = p.enabled;
            });

        this.consentService.consentChanged$
            .subscribe(c => {
                this.enabled = !c;
                this.enabledClass = this.ClassFromBoolean(c);
                this.enabledText = this.TextFromBoolean(c);
                this.cardclass = this.CardClassFromBoolean(c);
            })
    }

    public async toggle(event: MatSlideToggleChange) {
        await this.consentService.setPreference(this.notificationPreference.boundfield, event.checked);
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

    private CardClassFromBoolean(value: boolean): string {
        if (value === true) {
            return CardEnabledClassName;
        }
        return CardDisabledClassName;
    }
    
}
