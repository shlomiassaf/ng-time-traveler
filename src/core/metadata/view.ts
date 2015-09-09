/// <reference path="../../../typings/tsd.d.ts" />
/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/core/annotations_impl/view.ts */

import {StringFunc} from '../../ng/typings';

export class ViewMetadata {
    templateUrl: string | StringFunc;
    template: string  | StringFunc;

    constructor({templateUrl, template}: {
        templateUrl?: string | StringFunc,
        template?: string | StringFunc,
    } = {}) {
        this.templateUrl = templateUrl;
        this.template = template;
    }
}
