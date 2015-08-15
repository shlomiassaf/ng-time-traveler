/// <reference path="../../typings/tsd.d.ts" />

import {IAdapter, IAdapterStatic, findAnnotation, AnnotationType, RegisterInstruction} from "./adapterManager";
import {getTypeName} from "../facade/lang";
import {Directive, Component, INgttAnnotationMeta} from '../core/annotations_impl/annotations';
import {View} from '../core/annotations_impl/view';
import * as config from '../ng/config';

export class BaseAdapter  {
    constructor(public inst: RegisterInstruction) {
    }
}

export class ControllerAdapter extends BaseAdapter implements IAdapter{
    register() {
        this.inst.ngModule.controller(getTypeName(this.inst.cls), this.inst.cls);

    }
}

export class DirectiveAdapter extends BaseAdapter implements IAdapter{
    register() {
        if (this.inst.component) {
            this._registerView(this.inst.component, this.inst.view);
        }
        else if (this.inst.directive) {
            this._registerNoView(this.inst.directive);
        }
    }

    private _registerNoView(cmpt: Directive) {
        this.inst.ngModule.directive(cmpt.selector, () => new this.inst.cls());
    }

    private _registerView(cmpt: Component, view: View) {

        if (view.template) {
            this.inst.cls.prototype.template = view.template;
        }
        else if (view.templateUrl) {
            this.inst.cls.prototype.templateUrl = view.templateUrl;
        }

        this.inst.ngModule.directive(cmpt.selector, () => new this.inst.cls());
    }
}


interface PathRoute {
    path: string;
    route: ng.route.IRoute;
}
interface IRouteDictionary {
    [index: string]: PathRoute[];
}

export class NgRouteAdapter extends BaseAdapter implements IAdapter{

    constructor(inst: RegisterInstruction) {
        super(inst);
    }

    static routeCache: IRouteDictionary = {};

    routeConfig($routeProvider: ng.route.IRouteProvider) {
        let appName = this.inst.ngAppName;
        if (NgRouteAdapter.routeCache.hasOwnProperty(appName)) {
            let arr = NgRouteAdapter.routeCache[appName];
            while (arr.length > 0) {
                let pr: PathRoute = arr.pop();
                $routeProvider.when(pr.path, pr.route);
            }
        }
    }

    register() {
        let ctrl: Directive = this.inst.component || this.inst.directive;
        let view: View = this.inst.view;

        if (ctrl._ngtt && ctrl._ngtt.ngRoute && ctrl._ngtt.ngRoute.path) {
            let route: ng.route.IRoute = {};

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
NgRouteAdapter.prototype.routeConfig.$inject = ['$routeProvider'];

