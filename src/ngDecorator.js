/// <reference path="../typings/tsd.d.ts" />
var orgModuleFn;
var moduleCache = {};
var moduleNotifyCache = [];
function module(name, requires, configFn) {
    var md = orgModuleFn.apply(this, arguments);
    if (requires && requires.length > 0) {
        moduleCache[name] = md;
        moduleNotifyCache.forEach((mn) => mn.onNewModuleAdded.call(mn, name));
    }
    return md;
}
export function hasModule(name) {
    return moduleCache.hasOwnProperty(name);
}
export function notifyOnNewModule(messenger) {
    moduleNotifyCache.push(messenger);
}
export function init() {
    if (!angular) {
        throw new Error("angular not here.");
    }
    if (orgModuleFn)
        return;
    orgModuleFn = angular.module;
    angular.module = module;
}
//# sourceMappingURL=ngDecorator.js.map