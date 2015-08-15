
/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/core/annotations_impl/annotations.ts */

import {ABSTRACT, CONST, Type} from '../../facade/lang';

/**
 * Interface for ngRoute metadata annotation extension.
 * Extend at will..
 */
export interface INgRouteMeta {
    path: string,
    controllerAs?: string,
    resolve?: {[key: string]: any}
}

/**
 * Interface for extra annotation in a directive/component for ng-time-traver.
 * Extend at will.
 */
export interface INgttAnnotationMeta {
    ngApp?: string;
    ngRoute?: INgRouteMeta
}

export class NgttAnnotation {
    _ngtt: INgttAnnotationMeta;

    constructor(_ngtt?: INgttAnnotationMeta) {
        this._ngtt = _ngtt;
    }
}

@CONST()
export class Directive extends NgttAnnotation{
    selector: string;

    constructor({selector, _ngtt}: {
        selector?: string,
        _ngtt?: INgttAnnotationMeta,
    } = {}) {
        super(_ngtt);
        this.selector = selector;
    }
}

@CONST()
export class Component extends Directive {
    constructor({selector, _ngtt}: {
        selector?: string,
        _ngtt?: INgttAnnotationMeta,
    } = {}) {
        super({
            selector: selector,
            _ngtt: _ngtt
        });
    }
}