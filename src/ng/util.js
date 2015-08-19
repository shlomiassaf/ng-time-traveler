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
// couldnt find it in ng1...
export function camelToDash(str) {
    return str.replace(/\W+/g, '-')
        .replace(/([a-z\d])([A-Z])/g, '$1-$2');
}
//# sourceMappingURL=util.js.map