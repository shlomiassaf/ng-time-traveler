
/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/core/annotations_impl/view.ts */

import {ABSTRACT, CONST, Type} from '../../facade/lang';
import {StringFunc} from '../../ng/typings';


@CONST()
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