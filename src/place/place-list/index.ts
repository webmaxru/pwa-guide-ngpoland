import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../place.service';
import { Place } from '../place'

@Component({
    moduleId: module.id,
    selector: 'place-list',
    templateUrl: './place-list.html',
    styleUrls: ['./place-list.css']
})
export class PlaceListComponent implements OnInit {

    places: Array<Place>;

    constructor(private placeService: PlaceService) { }

    getPlaces(): void {
        this.placeService
            .getPlaces()
            .then(places => {
                this.places = places;
                console.log(this.places)
            });
        ;
    }

    ngOnInit(): void {
        this.getPlaces();
    }

}
