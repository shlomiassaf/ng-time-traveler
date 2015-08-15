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
import { Directive } from "../../src/ngtt";
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
//myModule.directive('directiveName', function factory(injectables) {
//    var directiveDefinitionObject = {
//        priority: 0,
//        template: '<div></div>', // or // function(tElement, tAttrs) { ... },
//        // or
//        // templateUrl: 'directive.html', // or // function(tElement, tAttrs) { ... },
//        transclude: false,
//        restrict: 'A',
//        templateNamespace: 'html',
//        scope: false,
//        controller: function($scope, $element, $attrs, $transclude, otherInjectables) { ... },
//        controllerAs: 'stringIdentifier',
//        bindToController: false,
//        require: 'siblingDirectiveName', // or // ['^parentDirectiveName', '?optionalDirectiveName', '?^optionalParent'],
//        compile: function compile(tElement, tAttrs, transclude) {
//            return {
//                pre: function preLink(scope, iElement, iAttrs, controller) { ... },
//                post: function postLink(scope, iElement, iAttrs, controller) { ... }
//            }
//            // or
//            // return function postLink( ... ) { ... }
//        },
//        // or
//        // link: {
//        //  pre: function preLink(scope, iElement, iAttrs, controller) { ... },
//        //  post: function postLink(scope, iElement, iAttrs, controller) { ... }
//        // }
//        // or
//        // link: function postLink( ... ) { ... }
//    };
//    return directiveDefinitionObject;
//});
//# sourceMappingURL=directive.js.map