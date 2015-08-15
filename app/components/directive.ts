/// <reference path="../../typings/tsd.d.ts" />

'use strict';
import {View, Component, Directive, config} from "../../src/ngtt";

@Directive({
    selector: 'viewLess',
    _ngtt: {
        ngApp: "myApp"
    }
})
export class ViewLess{
    restrict: string = 'EA';

    constructor() {
    }

    link(scope, iElement, iAttrs, controller) {
        iElement.html('<h1>Hi :)</h1>');
    }
}
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


