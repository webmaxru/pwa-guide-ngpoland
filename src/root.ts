import {Component, Renderer, ViewChild, QueryList, ElementRef, AfterViewInit, NgZone, ApplicationRef} from '@angular/core'

import 'rxjs/add/operator/do';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: './root.html',
    styleUrls: ['./root.css'],
})
export class RootComponent {

    title: String = 'ngPoland3';

}
