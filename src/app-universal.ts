import {AppShellModule} from '@angular/app-shell';
import {ModuleWithProviders, NgModule, Injectable} from '@angular/core';
import {UniversalModule, parseDocument} from 'angular2-universal/node';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {AppModule} from './app';
import {RootComponent} from './root';

import {Storage, InMemoryStorage} from './storage';

@NgModule({
  bootstrap: [RootComponent],
  imports: [
    AppShellModule.prerender(),
    AppModule,
    UniversalModule.withConfig({
      originUrl: 'http://localhost:8080',
      requestUrl: '/',
    }) as any as ModuleWithProviders,
  ],
  providers: [
    {provide: Storage, useClass: InMemoryStorage},
  ],
})
export class AppUniversalModule {}
