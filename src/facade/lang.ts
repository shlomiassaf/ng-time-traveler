/// <reference path="../../typings/tsd.d.ts" />

/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/facade/lang.ts */

export var global: any = <any>(typeof window === 'undefined' ? global : window);
export var isFunction = angular.isFunction;

export var Type = Function;
export interface Type extends Function { new (...args): any; }

export function CONST(): ClassDecorator {
    return (target) => target;
}

export function ABSTRACT(): ClassDecorator {
    return (t) => t;
}

export  function stringify(token): string {
    if (typeof token === 'string') {
        return token;
    }

    if (token === undefined || token === null) {
        return '' + token;
    }

    if (token.name) {
        return token.name;
    }

    var res = token.toString();
    var newLineIndex = res.indexOf("\n");
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}


/* NOT IN GITHUB REPO */
export interface StringMap<T extends string, Z> {
    [index: string]: Z;
}

/**
 * Returns the class name of an instance, or the class name if the type (constructor function) is provided.
 * @param clsOrObj
 * @returns {string}
 */
export function getTypeName(clsOrObj): string {
    if (clsOrObj) {
        let matchStr;

        if (typeof clsOrObj === "function") {
            matchStr = clsOrObj.toString();
        }
        else if (clsOrObj.constructor && clsOrObj.constructor.toString) {
            matchStr = clsOrObj.constructor.toString();
        }

        if (matchStr) {
            var arr = matchStr.match(
                /function\s*(\w+)/);

            if (arr && arr.length == 2) {
                return arr[1];
            }
        }
    }

    return undefined;
}