import { Injectable } from '@angular/core';
import { D365Service } from '../shared/d365.service';

@Injectable()

export class ConsentContext {

    public userId: string;

    public consentUrl: string;

    public onCreate = false;

    public onUpdate = false;

    public onDeactivate = false;

    constructor(private d365Service: D365Service) {}

    setConsent(consentRecord) {

        if (consentRecord !== undefined) {

        this.consentUrl = `${this.d365Service.clientUrl}/api/data/v${this.d365Service.apiVersion}/bartl_notificationconsents(${consentRecord.bartl_notificationconsentid})`;

        this.onCreate = consentRecord.bartl_oncreate;
        this.onUpdate = consentRecord.bartl_onchange;
        this.onDeactivate = consentRecord.bartl_ondisable;

        }
    }

}
