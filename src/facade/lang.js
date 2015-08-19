/// <reference path="../../typings/tsd.d.ts" />
/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/facade/lang.ts */
export var global = (typeof window === 'undefined' ? global : window);
export var isFunction = angular.isFunction;
export var Type = Function;
export function CONST() {
    return (target) => target;
}
export function ABSTRACT() {
    return (t) => t;
}
export function stringify(token) {
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
// couldnt find it in ng1...
export function camelToDash(str) {
    return str.replace(/\W+/g, '-')
        .replace(/([a-z\d])([A-Z])/g, '$1-$2');
}
/**
 * Returns the class name of an instance, or the class name if the type (constructor function) is provided.
 * @param clsOrObj
 * @returns {string}
 */
export function getTypeName(clsOrObj) {
    if (clsOrObj) {
        let matchStr;
        if (typeof clsOrObj === "function") {
            matchStr = clsOrObj.toString();
        }
        else if (clsOrObj.constructor && clsOrObj.constructor.toString) {
            matchStr = clsOrObj.constructor.toString();
        }
        if (matchStr) {
            var arr = matchStr.match(/function\s*(\w+)/);
            if (arr && arr.length == 2) {
                return arr[1];
            }
        }
    }
    return undefined;
}
//# sourceMappingURL=lang.js.map