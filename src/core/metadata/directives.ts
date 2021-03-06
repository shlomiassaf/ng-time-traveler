/// <reference path="../../../typings/tsd.d.ts" />
/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/core/annotations_impl/annotations.ts */

import {ABSTRACT, CONST, Type, global} from '../../facade/lang';


/**
 * Interface for ngRoute metadata annotation extension.
 * Extend at will..
 */
export interface INgRouteMeta {
    path: string,
    resolve?: {[key: string]: any},
    controllerAs?: string
}

/**
 * Interface for extra annotation in a directive/component for ng-time-traver.
 * Extend at will.
 */
export interface INgttAnnotationMeta {
    ngApp?: string;
    ngRoute?: INgRouteMeta;
}

export class NgttAnnotation {
    _ngtt: INgttAnnotationMeta;

    constructor(_ngtt?: INgttAnnotationMeta) {
        this._ngtt = _ngtt;
    }
}

export class DirectiveMetadata extends NgttAnnotation{
    selector: string;
    host: StringMap<string, string>;

    constructor({selector, host, _ngtt}: {
        selector?: string,
        host?: StringMap<string, string>,
        _ngtt?: INgttAnnotationMeta,
    } = {}) {
        super(_ngtt);
        this.selector = selector;
        this.host = host;
    }
}

export class ComponentMetadata extends DirectiveMetadata {
    constructor({selector, host, _ngtt}: {
        selector?: string,
        host?: StringMap<string, string>,
        _ngtt?: INgttAnnotationMeta,
    } = {}) {
        super({
            selector: selector,
            host: host,
            _ngtt: _ngtt
        });
    }
}

