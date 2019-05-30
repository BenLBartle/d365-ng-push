import { Injectable } from '@angular/core';
import { D365Service } from '../shared/d365.service';

@Injectable()

export class ConsentContext {

    public userId: string;

    public consentUrl: string;

    public adminMessages = false;

    public lowPriority = false;
    public standardPriority = false;
    public highPriority = false;

    public onDeactivate = false;

    constructor(private d365Service: D365Service) { }

    setConsent(consentRecord) {

        if (consentRecord !== undefined) {

            this.consentUrl = `${this.d365Service.clientUrl}/api/data/v${this.d365Service.apiVersion}/bartl_notificationconsents(${consentRecord.bartl_notificationconsentid})`;

            this.adminMessages = consentRecord.bartl_adminmessages;
            this.lowPriority = consentRecord.bartl_lowpriority;
            this.standardPriority = consentRecord.standardPriority;
            this.highPriority = consentRecord.highPriority;

        }
    }

    resetConsent() {
        
        this.adminMessages = false;
        this.lowPriority = false;
        this.standardPriority = false;
        this.highPriority = false;

    }

}
