import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';

@Component({
    moduleId: module.id,
    selector: 'dashboard',
    templateUrl: './dashboard.html',
})
export class DashboardComponent {
    result: string = null;
    action: string = '';
    alert: boolean = false;
    log: string[] = [];

    pushSub = null;
    pushes = [];

    actionSelected(action): void {
        this.action = action;
    }


    refresh(action) {
        this.result = null;
        if (this.pushSub !== null) {
            this.pushSub.unsubscribe();
            this.pushSub = null;
        }
        switch (action) {
            case 'RESET':
                this.alert = false;
                this.result = 'reset';
                break;
            case 'CACHE_KEYS':
                this.loadCacheKeys();
                break;
            case 'SW_CHECK':
                this.checkServiceWorker();
                break;
            default:
                this.result = null;
        }
    }

    loadCacheKeys(): void {
        let caches = window['caches'];
        caches.keys().then(keys => this.result = JSON.stringify(keys));
    }

    installWorker(url): void {
        navigator['serviceWorker'].register(url)
            .then(reg => {
                this.result = JSON.stringify({
                    result: {
                        scope: reg.scope
                    }
                });
            })
            .catch(err => {
                this.result = JSON.stringify({
                    error: `${err}`
                })
            });
    }

    checkServiceWorker(): void {
        this.result = '';
        navigator['serviceWorker']
            .getRegistrations()
            .then(registrations => {
                return registrations
                    .map(reg => {
                        return {
                            scope: reg.scope,
                            active: !!reg.active,
                            installing: !!reg.installing,
                            waiting: !!reg.waiting
                        };
                    })
            })
            .then(value => JSON.stringify(value))
            .then(value => {
                this.result = value;
            })
    }
}

@NgModule({
    declarations: [
        DashboardComponent
    ],
    exports: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule
    ],
    providers: []
})
export class DashboardModule { }
