/// <reference path="../../typings/tsd.d.ts" />

'use strict';
import {View, Component, Directive, config} from "../../src/ngtt";

@Component({
    selector: 'viewMore',
    host: {
        '(mouseenter)': 'onClick($event)',
        '[prop]': 'prop',
        '@action': 'Action()',
        'attr': 'AttrVal'
    },
    _ngtt: {
        ngApp: "myApp"
    }
})
@View({
    template: "<span>Hello Directive{{name}}</span>"
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
    };

    bindToController = true;

    //compile() {
    //    return {
    //        post: function() {}
    //    };
    //}
    link(scope, iElement, iAttrs, controller) {
        scope.name = "Shlomi";
        scope.onClick = function($event) {
            alert('okS');
        }
    }
}

function viewMoreController($scope) {

    this.hasScope = ($scope) ? true : false;
    this.onClick = function($event) {
        alert('ok');
    }
}
viewMoreController.$inject = ['$scope'];
