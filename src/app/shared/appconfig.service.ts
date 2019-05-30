import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfigService {

    static settings: IAppConfig;

    constructor(private http: HttpClient) { }
    load() {
        return (): Promise<any> => {
            const jsonFile = 'assets/config/appConfig.json';

            return new Promise<void>((resolve, reject) => {
                this.http.get(jsonFile)
                .toPromise()
                .then((response: IAppConfig) => {
                    AppConfigService.settings = <IAppConfig>response;

                    console.log('Config Loaded');
                    console.log(AppConfigService.settings);
                    resolve();

                }).catch((response: any) => {
                    reject(`Could not load the config file`);
                });
            });
        }
    }
}

export interface IAppConfig {
    FCMSettings: {
        apiKey: string,
        authDomain: string,
        databaseURL: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string
    }
}

