/// <reference path="../../typings/tsd.d.ts" />

'use strict';
import {View, Component, Directive, config} from "../../src/ngtt";

@Component({
    selector: 'viewMore',
    host: {
        '(event)': 'event',
        '[prop]': 'prop',
        '@action': 'Action()',
        'attr': 'AttrVal'
    },
    _ngtt: {
        ngApp: "myApp"
    }
})
@View({
    template: "<h1>Hello Directive{{name}}</h1>"
})
export class ViewMore{
    static $inject = [];

    restrict: string = 'EA';

    constructor() {

    }

    controllerAs = "ctrl123";
    controller: Function = viewMoreController

    scope = {
        name: '=name'
    }

    bindToController = true;

    //compile() {
    //    return {
    //        post: function() {}
    //    };
    //}
    link(scope, iElement, iAttrs, controller) {
        scope.name = "Shlomi";

    }
}

function viewMoreController($scope) {
    this.hasScope = ($scope) ? true : false;
}
viewMoreController.$inject = ['$scope'];
