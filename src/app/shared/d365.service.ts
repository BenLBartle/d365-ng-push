import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { WindowRef } from './windowref.service';

@Injectable()

export class D365Service {

    public clientUrl: string;
    public apiVersion = '9.1';

    constructor(private http: Http, private winRef: WindowRef) {
        this.clientUrl = 'https://bartl.crm11.dynamics.com';
        //winRef.nativeWindow.GetGlobalContext().getClientUrl();
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
        return new Headers({ 'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkhCeGw5bUFlNmd4YXZDa2NvT1UyVEhzRE5hMCIsImtpZCI6IkhCeGw5bUFlNmd4YXZDa2NvT1UyVEhzRE5hMCJ9.eyJhdWQiOiJodHRwczovL2JhcnRsLmNybTExLmR5bmFtaWNzLmNvbS8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wNzBiYTlkMS02NWFkLTQzODYtYmVjZi1mNmM2ZjdhZTRiZDkvIiwiaWF0IjoxNTU5NTc3MTU5LCJuYmYiOjE1NTk1NzcxNTksImV4cCI6MTU1OTU4MTA1OSwiYWlvIjoiNDJaZ1lPQVRQRDdmd2Y3NzdJNkVJOEdIMDFlWEF3QT0iLCJhcHBpZCI6IjQ4OTdlYTYxLWYwMTUtNDg2MC1hNzI2LWMxMjU5Y2ZmNzVmYiIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzA3MGJhOWQxLTY1YWQtNDM4Ni1iZWNmLWY2YzZmN2FlNGJkOS8iLCJvaWQiOiJmZTI2NGVjMi1hZTY2LTRkYmItODdlYi1iYWI0OGIzOWM5ZjciLCJzdWIiOiJmZTI2NGVjMi1hZTY2LTRkYmItODdlYi1iYWI0OGIzOWM5ZjciLCJ0aWQiOiIwNzBiYTlkMS02NWFkLTQzODYtYmVjZi1mNmM2ZjdhZTRiZDkiLCJ1dGkiOiJLcDBva2VBUUZFS0lqT1NDQzZkR0FBIiwidmVyIjoiMS4wIn0.aZMqBhY6NBeXSbDkJ9TXVWWb8ZimCcYD9_tky5h50NJ4cQVqPjto3UQ2a6CQzveM6zpvt-47FNqSzUnl_YCNyvxGahZpMqig8KBnEBLHxPGVl0RpGmVMtAGbXAQ_4HR-89r3tRtnaQvC-qi2TIiSEBhcDngAVpLRRif3i3FKV6n7oaOYn05EhbJOYmtMI8p2OI1tkiaeafmoumdlWU57HYJu47JTp23Pi2-Bya7eclBFuXnuWoklIQtoO1yLFbVHzHa5Xi71klS2oBqxJyAN2h4pYDhZ2JAbPj6xmU8eLxHBjthLk84oAw8YfWLV8pPBMSwCU59fmLSADq-WoZJ9Iw'});
    }

}
