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
    template: "<h1>Hello {{ctrl.name}}</h1><view-more name='ctrl.name'></view-more><view-more name='ctrl.nameTwo'></view-more>"
})
export class SomeCtrl{
    name: string;
    nameTwo: string;
    static $inject = [];
    constructor() {
        this.name = "Shlomi";
        this.nameTwo = "Shira";
    }
}