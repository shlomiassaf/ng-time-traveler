/// <reference path="../typings/tsd.d.ts" />

var orgModuleFn: (name: string,requires?: string[], configFn?: Function) => ng.IModule;

var moduleCache: {
    [index: string]: ng.IModule;
} = <any>{};

var moduleNotifyCache: INewAngularModuleNotifier[] = [];


function module(name: string,requires?: string[], configFn?: Function): ng.IModule {
    var md = orgModuleFn.apply(this, arguments);
    if (requires && requires.length>0) {
        moduleCache[name] = md;
        moduleNotifyCache.forEach((mn) => mn.onNewModuleAdded.call(mn, name));
    }
    return md;
}


export interface INewAngularModuleNotifier {
    onNewModuleAdded(name: string);
}

export function hasModule(name: string): boolean {
    return moduleCache.hasOwnProperty(name);
}

export function notifyOnNewModule(messenger: INewAngularModuleNotifier) {
    moduleNotifyCache.push(messenger);
}

export function init() {
    if (!angular) {
        throw new Error("angular not here.")
    }

    if (orgModuleFn) return;

    orgModuleFn = angular.module;
    angular.module = module;
}