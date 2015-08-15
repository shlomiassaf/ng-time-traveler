/// <reference path="../../typings/tsd.d.ts" />

'use strict';
import {View, Component, Directive, config} from "../../src/ngtt";

@Component({
    selector: 'viewMore',
    _ngtt: {
        ngApp: "myApp"
    }
})
@View({
    template: "<h1>Hello Directive{{name}}</h1>"
})
export class ViewMore{
    restrict: string = 'EA';

    constructor() {
    }

    link(scope, iElement, iAttrs, controller) {
        scope.name = "Shlomi";
    }
}