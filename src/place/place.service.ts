import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Place } from './place';

@Injectable()
export class PlaceService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = './assets/places.json';

  constructor(private http: Http) { }

  getPlaces(): Promise<Place[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as Place[])
  }

}
