'use strict';
import {View, Component, Directive, config} from "../../src/ngtt";

@Component({
    selector: '',
    _ngtt: {
        ngApp: "myApp",
        ngRoute: {
            path: '/hello',
            controllerAs: "ctrl"
        }
    }
})
@View({
    template: "<h1>Hello {{ctrl.name}}</h1><view-more></view-more>"
})
export class SomeCtrl{
    name: string;
    constructor() {
        this.name = "Shlomi";
    }
}