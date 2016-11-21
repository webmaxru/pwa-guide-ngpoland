import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RootComponent} from './root';

import {PlaceModule} from './place';
import {PlaceService} from './place/place.service';

@NgModule({
    bootstrap: [RootComponent],
    declarations: [
        RootComponent
    ],
    imports: [
        CommonModule,

        PlaceModule
    ]
})
export class AppModule { }
