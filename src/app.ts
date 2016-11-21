import {AppShellModule} from '@angular/app-shell';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RootComponent} from './root';

import {PlaceModule} from './place';

import {MaterialModule} from '@angular/material';

@NgModule({
    bootstrap: [RootComponent],
    declarations: [
        RootComponent
    ],
    imports: [
        AppShellModule,
        CommonModule,

        PlaceModule,

        MaterialModule.forRoot(),
    ]
})
export class AppModule { }
