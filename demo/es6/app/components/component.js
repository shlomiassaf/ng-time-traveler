'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var ngtt_1 = require("../../../../src/ngtt");
var MyHomePage = (function () {
    function MyHomePage() {
        this.bind1 = "Angular 1";
        this.bind2 = "Angular 2";
    }
    MyHomePage.$inject = [];
    MyHomePage = __decorate([
        ngtt_1.Component({
            selector: '',
            _ngtt: {
                ngApp: "myApp",
                ngRoute: {
                    path: '/hello',
                    controllerAs: "ctrl"
                }
            }
        }),
        ngtt_1.View({
            template: "\n    <h1>Hello {{ctrl.bind1}} and {{ctrl.bind2}}</h1>\n    <p>This is an NG1 controller registered automatically simply by adding NG2 style metadata to it.</p>\n    <h3>We can also include directive with the same approach and attach host events/properties to it!</h3>\n    <view-more name='ctrl.bind1'></view-more> <-- <b>click to test event binding</b><br /></br>\n    F12 and look at the direvtive, it should also have an attribute <b>my-attribute-nice</b> with a value.\n    "
        })
    ], MyHomePage);
    return MyHomePage;
})();
exports.MyHomePage = MyHomePage;
//# sourceMappingURL=component.js.map