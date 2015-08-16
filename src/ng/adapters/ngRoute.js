/// <reference path="../../../typings/tsd.d.ts" />
import { getTypeName } from "../../facade/lang";
import { BaseAdapter } from "./base";
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
//# sourceMappingURL=ngRoute.js.map