/// <reference path="../../../../typings/tsd.d.ts" />
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
var ViewMore = (function () {
    function ViewMore() {
        this.restrict = 'EA';
        this.controllerAs = "ctrl123";
        this.controller = viewMoreController;
        this.scope = {
            name: '=name'
        };
        this.bindToController = true;
    }
    ViewMore.prototype.link = function (scope, iElement, iAttrs, controller) {
    };
    ViewMore.$inject = [];
    ViewMore = __decorate([
        ngtt_1.Component({
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
        }),
        ngtt_1.View({
            template: "<span>Hello Directive {{ctrl123.name}}</span>"
        })
    ], ViewMore);
    return ViewMore;
})();
exports.ViewMore = ViewMore;
//$scope, $element, $attrs, $transclude,
function viewMoreController($scope) {
    var self = this;
    this.hasScope = ($scope) ? true : false;
    this.onClick = function ($event) {
        self.ngTemp = "1422";
        alert('ok');
    };
}
viewMoreController.$inject = ['$scope'];
//# sourceMappingURL=directiveWithView.js.map