'use strict';
import {View, Component, Directive, config} from "../../../../src/ngtt";

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
    template: `
    <h1>Hello {{ctrl.bind1}} and {{ctrl.bind2}}</h1>
    <p>This is an NG1 controller registered automatically simply by adding NG2 style metadata to it.</p>
    <h3>We can also include directive with the same approach and attach host events/properties to it!</h3>
    <view-more name='ctrl.bind1'></view-more> <-- <b>click to test event binding</b><br /></br>
    F12 and look at the direvtive, it should also have an attribute <b>my-attribute-nice</b> with a value.
    `
})
export class MyHomePage{
    bind1: string;
    bind2: string;
    static $inject = [];
    constructor() {
        this.bind1 = "Angular 1";
        this.bind2 = "Angular 2";
    }
}