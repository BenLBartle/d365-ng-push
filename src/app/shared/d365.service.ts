import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()

export class D365Service {

    private clientUrl = "https://bartl.crm11.dynamics.com/";
    private apiVersion = "9.1";

    constructor(private http: Http) { }

    async getConsent(userId: string) {

        const options = { headers: this.getHeaders(), observe: 'response' };
        const result = await this.http.get(`${this.clientUrl}/api/data/v${this.apiVersion}/bartl_notificationconsents?$filter=bartl_User/systemuserid eq ${userId}`, options)
            .pipe(map(response => response.json())).toPromise();

        console.log(result.value);
        if (result.value.length >= 1) {
            console.log(`${this.clientUrl}/api/data/v${this.apiVersion}/bartl_notificationconsents(${result.value[0].bartl_notificationconsentid})`);
            return `${this.clientUrl}/api/data/v${this.apiVersion}/bartl_notificationconsents(${result.value[0].bartl_notificationconsentid})`
        }
        else {
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
            'bartl_consenttoken': consentToken
        };
        const result = await this.http.post(`${this.clientUrl}/api/data/v${this.apiVersion}/bartl_notificationconsents`, record, options)
            .pipe(map(response => response.json()))
            .toPromise();

        const consentUrl = result.headers.get('OData-EntityId');

        console.log(consentUrl)

        return consentUrl;
    }

    async notificatonCreateToggle(consentUrl: string, toggleValue: boolean) {
        const options = { headers: this.getHeaders() };
        const record = {
            'bartl_oncreate': toggleValue,
        };

        await this.http.patch(consentUrl, record, options).pipe(map(response => response.json()))
        .toPromise();
    }

    async notificatonUpateToggle(consentUrl: string, toggleValue: boolean) {
        const options = { headers: this.getHeaders() };
        const record = {
            'bartl_onupdate': toggleValue,
        };

        await this.http.patch(consentUrl, record, options).pipe(map(response => response.json()))
        .toPromise();
    }

    async notificatonDeactivateToggle(consentUrl: string, toggleValue: boolean) {
        const options = { headers: this.getHeaders() };
        const record = {
            'bartl_ondeactivate': toggleValue,
        };

        await this.http.patch(consentUrl, record, options).pipe(map(response => response.json()))
        .toPromise();
    }

    async deleteConsent(consentUrl: string) {
        const options = { headers: this.getHeaders(), observe: 'response' };
        await this.http.delete(consentUrl, options);
    }

    getHeaders() {
        return new Headers({ 'Authorization': 'Bearer JUNK' });
    }

}