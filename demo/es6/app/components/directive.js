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
var ViewLess = (function () {
    function ViewLess() {
        this.restrict = 'EA';
    }
    ViewLess.prototype.link = function (scope, iElement, iAttrs, controller) {
        iElement.html('<h4>Hi, im a simple directive without any view, this content is added at runtime.:)</h4>');
    };
    ViewLess = __decorate([
        ngtt_1.Directive({
            selector: 'viewLess',
            _ngtt: {
                ngApp: "myApp"
            }
        })
    ], ViewLess);
    return ViewLess;
})();
exports.ViewLess = ViewLess;
//# sourceMappingURL=directive.js.map