/// <reference path="../../../../typings/tsd.d.ts" />

'use strict';
import {View, Component, Directive, config} from "../../../../src/ngtt";

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
        iElement.html('<h4>Hi, im a simple directive without any view, this content is added at runtime.:)</h4>');
    }
}


