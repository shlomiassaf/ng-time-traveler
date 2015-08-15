/// <reference path="../../typings/tsd.d.ts" />
import { getTypeName } from "../facade/lang";
export class BaseAdapter {
    constructor(inst) {
        this.inst = inst;
    }
}
export class ControllerAdapter extends BaseAdapter {
    register() {
        this.inst.ngModule.controller(getTypeName(this.inst.cls), this.inst.cls);
    }
}
export class DirectiveAdapter extends BaseAdapter {
    register() {
        if (this.inst.component) {
            this._registerView(this.inst.component, this.inst.view);
        }
        else if (this.inst.directive) {
            this._registerNoView(this.inst.directive);
        }
    }
    _registerNoView(cmpt) {
        this.inst.ngModule.directive(cmpt.selector, () => new this.inst.cls());
    }
    _registerView(cmpt, view) {
        if (view.template) {
            this.inst.cls.prototype.template = view.template;
        }
        else if (view.templateUrl) {
            this.inst.cls.prototype.templateUrl = view.templateUrl;
        }
        this.inst.ngModule.directive(cmpt.selector, () => new this.inst.cls());
    }
}
export class NgRouteAdapter extends BaseAdapter {
    constructor(inst) {
        super(inst);
    }
    routeConfig($routeProvider) {
        let appName = this.inst.ngAppName;
        if (NgRouteAdapter.routeCache.hasOwnProperty(appName)) {
            let arr = NgRouteAdapter.routeCache[appName];
            while (arr.length > 0) {
                let pr = arr.pop();
                $routeProvider.when(pr.path, pr.route);
            }
        }
    }
    register() {
        let ctrl = this.inst.component || this.inst.directive;
        let view = this.inst.view;
        if (ctrl._ngtt && ctrl._ngtt.ngRoute && ctrl._ngtt.ngRoute.path) {
            let route = {};
            route.controller = this.inst.cls;
            route.controllerAs = ctrl._ngtt.ngRoute.controllerAs || getTypeName(this.inst.cls);
            if (view.template) {
                route.template = view.template;
            }
            else if (view.templateUrl) {
                route.templateUrl = view.templateUrl;
            }
            if (ctrl._ngtt.ngRoute.resolve) {
                route.resolve = ctrl._ngtt.ngRoute.resolve;
            }
            let appName = this.inst.ngAppName;
            if (!NgRouteAdapter.routeCache.hasOwnProperty(appName)) {
                NgRouteAdapter.routeCache[appName] = [];
                let app = this.inst.ngModule;
                app.config(['$routeProvider', this.routeConfig.bind(this)]);
            }
            NgRouteAdapter.routeCache[appName].push({
                path: ctrl._ngtt.ngRoute.path,
                route: route
            });
        }
    }
}
NgRouteAdapter.routeCache = {};
NgRouteAdapter.prototype.routeConfig.$inject = ['$routeProvider'];
//# sourceMappingURL=adapters.js.map