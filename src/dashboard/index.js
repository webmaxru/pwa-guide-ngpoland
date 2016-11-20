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
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var core_2 = require("@angular/core");
require("rxjs/add/operator/scan");
require("rxjs/add/operator/startWith");
var DashboardComponent = (function () {
    function DashboardComponent() {
        this.result = null;
        this.action = '';
        this.alert = false;
        this.log = [];
        this.pushSub = null;
        this.pushes = [];
    }
    DashboardComponent.prototype.actionSelected = function (action) {
        this.action = action;
    };
    DashboardComponent.prototype.request = function (url) {
    };
    DashboardComponent.prototype.refresh = function (action) {
        this.result = null;
        if (this.pushSub !== null) {
            this.pushSub.unsubscribe();
            this.pushSub = null;
        }
        switch (action) {
            case 'RESET':
                this.alert = false;
                this.result = 'reset';
                break;
            case 'FORCE_UPDATE':
                break;
            case 'CACHE_KEYS':
                this.loadCacheKeys();
                break;
            case 'SW_CHECK':
                this.checkServiceWorker();
                break;
            case 'COMPANION_PING':
                break;
            case 'COMPANION_REG_PUSH':
                break;
            case 'COMPANION_WAIT_FOR_PUSH':
            default:
                this.result = null;
        }
    };
    DashboardComponent.prototype.loadCacheKeys = function () {
        var _this = this;
        var caches = window['caches'];
        caches.keys().then(function (keys) { return _this.result = JSON.stringify(keys); });
    };
    DashboardComponent.prototype.installWorker = function (url) {
        var _this = this;
        navigator['serviceWorker'].register(url)
            .then(function (reg) {
            _this.result = JSON.stringify({
                result: {
                    scope: reg.scope
                }
            });
        })
            .catch(function (err) {
            _this.result = JSON.stringify({
                error: "" + err
            });
        });
    };
    DashboardComponent.prototype.checkServiceWorker = function () {
        var _this = this;
        this.result = '';
        navigator['serviceWorker']
            .getRegistrations()
            .then(function (registrations) {
            return registrations
                .map(function (reg) {
                return {
                    scope: reg.scope,
                    active: !!reg.active,
                    installing: !!reg.installing,
                    waiting: !!reg.waiting
                };
            });
        })
            .then(function (value) { return JSON.stringify(value); })
            .then(function (value) {
            _this.result = value;
        });
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_2.Component({
        selector: 'dashboard',
        templateUrl: './dashboard.html',
    }),
    __metadata("design:paramtypes", [])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
var DashboardModule = (function () {
    function DashboardModule() {
    }
    return DashboardModule;
}());
DashboardModule = __decorate([
    core_1.NgModule({
        declarations: [
            DashboardComponent
        ],
        exports: [
            DashboardComponent
        ],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            platform_browser_1.BrowserModule
        ],
        providers: []
    }),
    __metadata("design:paramtypes", [])
], DashboardModule);
exports.DashboardModule = DashboardModule;
