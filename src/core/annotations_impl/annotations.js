/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/core/annotations_impl/annotations.ts */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { CONST } from '../../facade/lang';
export class NgttAnnotation {
    constructor(_ngtt) {
        this._ngtt = _ngtt;
    }
}
export let Directive = class extends NgttAnnotation {
    constructor({ selector, _ngtt } = {}) {
        super(_ngtt);
        this.selector = selector;
    }
};
Directive = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Directive);
export let Component = class extends Directive {
    constructor({ selector, _ngtt } = {}) {
        super({
            selector: selector,
            _ngtt: _ngtt
        });
    }
};
Component = __decorate([
    CONST(), 
    __metadata('design:paramtypes', [Object])
], Component);
//# sourceMappingURL=annotations.js.map