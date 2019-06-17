import { Injectable } from '@angular/core';
import { D365Service } from './d365.service';
import { AngularFireMessaging, AngularFireMessagingModule } from '@angular/fire/messaging';
import { Subject } from 'rxjs';
import { NotificationPreferenceChanged } from './notification-preference-changed.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfigService } from './appconfig.service';
import * as firebase from 'firebase';

const ErrorLoadingDynamicsMessage = "😢 There was an error getting your details from the system, please try again."

@Injectable()
export class ConsentService {

    public userId: string;
    public consentUrl: string;

    public adminMessages: boolean = false;
    public lowPriority: boolean = false;
    public standardPriority: boolean = false;
    public highPriority: boolean = false;

    private consentChangedSource = new Subject<boolean>();
    private permissionChangedSource = new Subject<NotificationPreferenceChanged>();

    consentChanged$ = this.consentChangedSource.asObservable();
    permissionChanged$ = this.permissionChangedSource.asObservable();

    constructor(private angularFireMessaging: AngularFireMessaging, private d365Service: D365Service, private snackBar: MatSnackBar) {
        
        firebase.initializeApp(AppConfigService.settings.FCMSettings);
        
        this.d365Service.getUserId()
            .then(result => {
                this.userId = result;
            })
            .then(() => this.d365Service.getConsent(this.userId))
            .then(result => {
                if (result !== undefined) {

                    this.consentUrl = `${this.d365Service.clientUrl}/api/data/v${this.d365Service.apiVersion}/bartl_notificationconsents(${result.bartl_notificationconsentid})`;

                    this.adminMessages = result.bartl_administratormessages;
                    this.lowPriority = result.bartl_lowpriority;
                    this.standardPriority = result.bartl_standardpriority;
                    this.highPriority = result.bartl_highpriority;

                    this.consentChangedSource.next(true);

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_administratormessages',
                        enabled: this.adminMessages
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_lowpriority',
                        enabled: this.lowPriority
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_standardpriority',
                        enabled: this.standardPriority
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_highpriority',
                        enabled: this.highPriority
                    });
                }
                else 
                {
                    this.consentChangedSource.next(false);

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_administratormessages',
                        enabled: false
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_lowpriority',
                        enabled: false
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_standardpriority',
                        enabled: false
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_highpriority',
                        enabled: false
                    });
                }
            })
            .catch(() => {
                this.snackBar.open(ErrorLoadingDynamicsMessage, 'Dismiss', {
                    duration: 5000,
                    verticalPosition: 'top'
                });

                this.consentChangedSource.next(false);
            })

    }

    requestPermission() {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                this.d365Service.createConsent(this.userId, token).then(consentUrl => {
                    this.consentUrl = consentUrl
                });
                this.consentChangedSource.next(true);
            },
            (err) => {
                this.consentChangedSource.next(false);
                console.error('Unable to get permission to notify.', err);
            }
        );
    }

    public async setPreference(boundfield: string, checked: boolean) {
        await this.d365Service.notificationToggle(this.consentUrl, boundfield, checked);
        this.permissionChangedSource.next({
            boundfield: boundfield,
            enabled: checked
        })
    }

    public async resetConsent() {

        this.adminMessages = false;
        this.lowPriority = false;
        this.standardPriority = false;
        this.highPriority = false;
        

        await this.d365Service.deleteConsent(this.consentUrl);
        this.consentUrl = null;

        this.permissionChangedSource.next({
            boundfield: 'bartl_adminmessages',
            enabled: false
        });

        this.permissionChangedSource.next({
            boundfield: 'bartl_lowpriority',
            enabled: false
        });

        this.permissionChangedSource.next({
            boundfield: 'standardPriority',
            enabled: false
        });

        this.permissionChangedSource.next({
            boundfield: 'highPriority',
            enabled: false
        });

        this.consentChangedSource.next(false);
    }
}
