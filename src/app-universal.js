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
var app_shell_1 = require("@angular/app-shell");
var core_1 = require("@angular/core");
var node_1 = require("angular2-universal/node");
require("rxjs/add/observable/of");
var app_1 = require("./app");
var root_1 = require("./root");
var storage_1 = require("./storage");
var AppUniversalModule = (function () {
    function AppUniversalModule() {
    }
    return AppUniversalModule;
}());
AppUniversalModule = __decorate([
    core_1.NgModule({
        bootstrap: [root_1.RootComponent],
        imports: [
            app_shell_1.AppShellModule.prerender(),
            app_1.AppModule,
            node_1.UniversalModule.withConfig({
                originUrl: 'http://localhost:8080',
                requestUrl: '/',
            }),
        ],
        providers: [
            { provide: storage_1.Storage, useClass: storage_1.InMemoryStorage },
        ],
    }),
    __metadata("design:paramtypes", [])
], AppUniversalModule);
exports.AppUniversalModule = AppUniversalModule;
