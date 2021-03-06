/// <reference path="../../../../typings/tsd.d.ts" />

'use strict';
import {View, Component, Directive, config} from "../../../../src/ngtt";

@Component({
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
})
@View({
    template: "<span>Hello Directive {{ctrl123.name}}</span>"
})
export class ViewMore {

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

    link(scope, iElement, iAttrs, controller) {
    }
}

//$scope, $element, $attrs, $transclude,
function viewMoreController($scope) {
    var self = this;

    this.hasScope = ($scope) ? true : false;

    this.onClick = function($event) {
        self.ngTemp = "1422";
        alert('ok');
    }
}
viewMoreController.$inject = ['$scope'];
