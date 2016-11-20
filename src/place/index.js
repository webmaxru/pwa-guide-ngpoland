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
var common_1 = require("@angular/common");
var place_service_1 = require("./place.service");
var place_list_1 = require("./place-list");
var material_1 = require("@angular/material");
var PlaceModule = (function () {
    function PlaceModule() {
    }
    return PlaceModule;
}());
PlaceModule = __decorate([
    core_1.NgModule({
        declarations: [
            place_list_1.PlaceListComponent
        ],
        exports: [
            place_list_1.PlaceListComponent
        ],
        imports: [
            common_1.CommonModule,
            material_1.MaterialModule.forRoot()
        ],
        providers: [
            place_service_1.PlaceService
        ]
    }),
    __metadata("design:paramtypes", [])
], PlaceModule);
exports.PlaceModule = PlaceModule;
