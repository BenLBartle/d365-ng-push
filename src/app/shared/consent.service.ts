import { Injectable } from '@angular/core';
import { D365Service } from './d365.service';
import { AngularFireMessaging, AngularFireMessagingModule } from '@angular/fire/messaging';
import { Subject } from 'rxjs';
import { NotificationPreferenceChanged } from './notification-preference-changed.type';
import { MatSnackBar } from '@angular/material/snack-bar';

const ErrorLoadingDynamicsMessage = "😢 There was an error getting your details from the system, please try again."

@Injectable()
export class ConsentService {

    public userId: string;

    public consentUrl: string;

    public adminMessages = false;

    public lowPriority = false;
    public standardPriority = false;
    public highPriority = false;

    public onDeactivate = false;

    private consentChangedSource = new Subject<boolean>();
    private permissionChangedSource = new Subject<NotificationPreferenceChanged>();

    consentChanged$ = this.consentChangedSource.asObservable();
    permissionChanged$ = this.permissionChangedSource.asObservable();

    constructor(private angularFireMessaging: AngularFireMessaging, private d365Service: D365Service, private snackBar: MatSnackBar) {
        this.d365Service.getUserId()
            .then(result => {
                this.userId = result;
            })
            .then(() => this.d365Service.getConsent(this.userId))
            .then(result => {
                if (result !== undefined) {

                    this.consentUrl = `${this.d365Service.clientUrl}/api/data/v${this.d365Service.apiVersion}/bartl_notificationconsents(${result.bartl_notificationconsentid})`;

                    this.adminMessages = result.bartl_adminmessages;
                    this.lowPriority = result.bartl_lowpriority;
                    this.standardPriority = result.standardPriority;
                    this.highPriority = result.highPriority;

                    this.consentChangedSource.next(true);

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_adminmessages',
                        enabled: this.adminMessages
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'bartl_lowpriority',
                        enabled: this.lowPriority
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'standardPriority',
                        enabled: this.standardPriority
                    });

                    this.permissionChangedSource.next({
                        boundfield: 'highPriority',
                        enabled: this.highPriority
                    });
                }

                else {
                    this.consentChangedSource.next(false);

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

    requestPermission(userId) {
        this.angularFireMessaging.requestToken.subscribe(
            (token) => {
                this.d365Service.createConsent(userId, token).then(consentUrl => {
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

    resetConsent() {

        this.adminMessages = false;
        this.lowPriority = false;
        this.standardPriority = false;
        this.highPriority = false;

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
