/// <reference path="../../../../typings/tsd.d.ts" />
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
import { Directive } from "../../../../src/ngtt";
export let ViewLess = class {
    constructor() {
        this.restrict = 'EA';
    }
    link(scope, iElement, iAttrs, controller) {
        iElement.html('<h1>Hi :)</h1>');
    }
};
ViewLess = __decorate([
    Directive({
        selector: 'viewLess',
        _ngtt: {
            ngApp: "myApp"
        }
    }), 
    __metadata('design:paramtypes', [])
], ViewLess);
//# sourceMappingURL=directive.js.map