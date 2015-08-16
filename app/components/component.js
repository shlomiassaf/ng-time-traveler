'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { View, Component } from "../../src/ngtt";
export let SomeCtrl = class {
    constructor() {
        this.name = "Shlomi";
        this.nameTwo = "Shira";
    }
};
SomeCtrl.$inject = [];
SomeCtrl = __decorate([
    Component({
        selector: '',
        _ngtt: {
            ngApp: "myApp",
            ngRoute: {
                path: '/hello',
                controllerAs: "ctrl"
            }
        }
    }),
    View({
        template: "<h1>Hello {{ctrl.name}}</h1><view-more name='ctrl.name'></view-more><view-more name='ctrl.nameTwo'></view-more>"
    }), 
    __metadata('design:paramtypes', [])
], SomeCtrl);
//# sourceMappingURL=component.js.map