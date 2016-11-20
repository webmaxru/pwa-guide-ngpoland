"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var data_1 = require("./weather/data");
require("rxjs/add/operator/do");
var RootComponent = (function () {
    function RootComponent(weatherData) {
        var _this = this;
        this.weatherData = weatherData;
        this.viewState = {};
        this.cities = [];
        this.title = 'ngPoland';
        weatherData.cities
            .do(function (cities) { return console.log('cities', cities); })
            .subscribe(function (cities) { return _this.cities = cities; });
    }
    RootComponent.prototype.showPicker = function () {
        this.setDialogState(true);
    };
    RootComponent.prototype.addCity = function (city) {
        this.setDialogState(false);
        this.weatherData.addCity(city);
    };
    RootComponent.prototype.onCancel = function (event) {
        this.setDialogState(false);
    };
    RootComponent.prototype.refresh = function () {
        this.weatherData.refreshData();
    };
    RootComponent.prototype.setDialogState = function (show) {
        this.viewState['dialog-container--visible'] = show;
    };
    return RootComponent;
}());
RootComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ngw-root',
        templateUrl: './root.html',
        styleUrls: ['./root.css'],
    }),
    __metadata("design:paramtypes", [data_1.WeatherData])
], RootComponent);
exports.RootComponent = RootComponent;
