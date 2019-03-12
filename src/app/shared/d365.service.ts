import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()

export class D365Service {

    private clientUrl = "https://bartl.crm11.dynamics.com/";
    private apiVersion = "9.1";

    constructor (private http: Http) {}

    getConsent(userId: string) {

        const options  = new RequestOptions({ headers: this.getHeaders()});
        const result = this.http.get(`${this.clientUrl}/api/data/v${this.apiVersion}/bartl_notificationconsents?$filter=bartl_User/systemuserid eq ${userId}`, {withCredentials: true})
        .pipe(map(response => response.json()))
        .subscribe(result => {
            console.log(result);
        });
        
    }

    getHeaders() {
        return new Headers({'cookie': 'ReqClientId=abd3f049-9420-4810-9087-3da49b9a915d; orgId=e5837f68-5fa2-4618-b6c1-10d5eef35116; ai_user=zKbDE|2019-03-08T20:12:03.361Z; NotificationRedirection=NotificationRedirection_Reason=notMemberOfOrg&NotificationRedirection_OriginalRequestUrl=https://bartl.crm11.dynamics.com/main.aspx?settingsonly=true; ai_session=oAReV|1552422888565.505|1552423448868.255'});
    }

}