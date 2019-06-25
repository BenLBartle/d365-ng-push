import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { WindowRef } from './windowref.service';

@Injectable()

export class D365Service {

    public clientUrl: string;
    public apiVersion = '9.1';

    constructor(private http: Http, private winRef: WindowRef) {
        this.clientUrl = winRef.nativeWindow.GetGlobalContext().getClientUrl();
     }

    async getConsent(userId: string) {

        const options = { headers: this.getHeaders(), observe: 'response' };
        const result = await this.http.get(`${this.clientUrl}/api/data/v${this.apiVersion}/bartl_notificationconsents?$filter=bartl_User/systemuserid eq ${userId}`, options)
            .pipe(map(response => response.json())).toPromise();

        console.log(result.value);
        if (result.value.length >= 1) {
            return result.value[0];
        } else {
            return undefined;
        }
    }

    async getUserId() {
        const options = new RequestOptions({ headers: this.getHeaders() });
        const result = await this.http.get(`${this.clientUrl}/api/data/v${this.apiVersion}/WhoAmI()`, options)
            .pipe(map(response => response.json()))
            .toPromise();

        console.log(result.UserId);

        return result.UserId;
    }

    async createConsent(userId: string, consentToken: string) {
        const options = { headers: this.getHeaders(), observe: 'response' };
        const record = {
            'bartl_User@odata.bind': `/systemusers(${userId})`,
            bartl_consenttoken: consentToken
        };
        const result = await this.http.post(`${this.clientUrl}/api/data/v${this.apiVersion}/bartl_notificationconsents`, record, options)
            .toPromise();

        const consentUrl = result.headers.get('OData-EntityId');

        console.log(consentUrl);

        return consentUrl;
    }

    
    async notificationToggle(consentUrl: string, fieldValue: string, toggleValue: boolean) {
        const options = { headers: this.getHeaders() };
        const record = {
            [fieldValue]: toggleValue,
        };

        await this.http.patch(consentUrl, record, options).pipe(map(response => response.json()))
        .toPromise();
    }
   
    async deleteConsent(consentUrl: string) {
        const options = { headers: this.getHeaders() };
        console.log("Deleting Consent: " + consentUrl);
        await this.http.delete(consentUrl, options).toPromise();
    }

    getHeaders() {
        return new Headers();
    }

}
