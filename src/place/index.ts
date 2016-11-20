import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlaceService} from './place.service';
import {PlaceListComponent} from './place-list';

import {MaterialModule} from '@angular/material';

@NgModule({
    declarations: [
        PlaceListComponent
    ],
    exports: [
        PlaceListComponent
    ],
    imports: [
        CommonModule,
        MaterialModule.forRoot()
    ],
    providers: [
        PlaceService
    ]
})
export class PlaceModule { }
