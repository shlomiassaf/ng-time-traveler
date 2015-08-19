/// <reference path="../../typings/tsd.d.ts" />
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
export let ViewMore = class {
    constructor() {
        this.restrict = 'EA';
        this.controllerAs = "ctrl123";
        this.controller = viewMoreController;
        this.scope = {
            name: '=name'
        };
        this.bindToController = true;
    }
    //compile() {
    //    return {
    //        post: function() {}
    //    };
    //}
    link(scope, iElement, iAttrs, controller) {
    }
};
ViewMore.$inject = [];
ViewMore = __decorate([
    Component({
        selector: 'viewMore',
        host: {
            '(click)': 'onClick($event)',
            '[text]': 'ngTemp',
            '@action': 'Action()',
            'myAttributeNice': 'AttrVal'
        },
        _ngtt: {
            ngApp: "myApp"
        }
    }),
    View({
        template: "<span>Hello Directive{{name}}</span>"
    }), 
    __metadata('design:paramtypes', [])
], ViewMore);
function viewMoreController($scope) {
    var self = this;
    this.hasScope = ($scope) ? true : false;
    this.onClick = function ($event) {
        self.ngTemp = "1422";
        alert('ok');
    };
}
viewMoreController.$inject = ['$scope'];
//# sourceMappingURL=directiveWithView.js.map