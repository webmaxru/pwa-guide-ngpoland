import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {NgServiceWorker} from '@angular/service-worker';

import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';

@Component({
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

  constructor(public sw: NgServiceWorker) {
    sw.log().subscribe(message => this.log.push(message));
  }

  actionSelected(action): void {
    this.action = action;
  }

  request(url: string): void {
    // fetch(url).then(resp => resp.text()).then(text => {
    //   this.result = text;
    // });
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
      case 'FORCE_UPDATE':
        this
          .sw
          .checkForUpdate()
          .subscribe(res => {
            this.result = JSON.stringify(res);
            this.alert = true;
          });
        break;
      case 'CACHE_KEYS':
        this.loadCacheKeys();
        break;
      case 'SW_CHECK':
        this.checkServiceWorker();
        break;
      case 'COMPANION_PING':
        this
          .sw
          .ping()
          .subscribe(undefined, undefined, () => {
            this.result = 'pong';
            this.alert = true;
          });
        break;
      case 'COMPANION_REG_PUSH':
        this
          .sw
          .registerForPush()
          .subscribe(handler => {
            this.result = JSON.stringify({
              id: handler.id,
              url: handler.url,
              key: handler.key(),
              auth: handler.auth()
            });
            this.alert = true;
          });
          break;
        case 'COMPANION_WAIT_FOR_PUSH':
          this.pushSub = this
            .sw
            .push
            .take(1)
            .map(value => JSON.stringify(value))
            .subscribe(value => {
              this.result = value;
              this.alert = true;
            });
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
export class DashboardModule {}
