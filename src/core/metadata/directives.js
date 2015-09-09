/// <reference path="../../../typings/tsd.d.ts" />
/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/core/annotations_impl/annotations.ts */
export class NgttAnnotation {
    constructor(_ngtt) {
        this._ngtt = _ngtt;
    }
}
export class DirectiveMetadata extends NgttAnnotation {
    constructor({ selector, host, _ngtt } = {}) {
        super(_ngtt);
        this.selector = selector;
        this.host = host;
    }
}
export class ComponentMetadata extends DirectiveMetadata {
    constructor({ selector, host, _ngtt } = {}) {
        super({
            selector: selector,
            host: host,
            _ngtt: _ngtt
        });
    }
}
//# sourceMappingURL=directives.js.map