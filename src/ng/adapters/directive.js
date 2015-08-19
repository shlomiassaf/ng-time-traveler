/// <reference path="../../../typings/tsd.d.ts" />
import { Map, MapWrapper } from "../../facade/collection";
import { isPresent, isBlank, RegExpWrapper } from "../../facade/lang";
import { getTypeName, camelToDash } from "../../ng/util";
import { BaseAdapter } from "./base";
export var LinkingInstructionType;
(function (LinkingInstructionType) {
    LinkingInstructionType[LinkingInstructionType["fn"] = 1] = "fn";
    LinkingInstructionType[LinkingInstructionType["pre"] = 2] = "pre";
    LinkingInstructionType[LinkingInstructionType["post"] = 4] = "post";
})(LinkingInstructionType || (LinkingInstructionType = {}));
/**
 * Inspect a linking function and return its location/type
 * Returns an enum flag, 1: linkFn, 2: link->pre, 4: link->post, 6: link->pre+post
 * @param obj
 * @returns {number}
 */
function identifyLinkingFn(linkObj) {
    let fn, result = 0;
    if (linkObj) {
        if (angular.isFunction(linkObj)) {
            result = LinkingInstructionType.fn;
        }
        else {
            if (angular.isFunction(linkObj.pre)) {
                result = result | LinkingInstructionType.pre;
            }
            if (angular.isFunction(linkObj.post)) {
                result = result | LinkingInstructionType.post;
            }
        }
    }
    return result;
}
function linkFnWrapperFactory(originalLinkFn, beforeLink) {
    return function () {
        return originalLinkFn.apply(this, beforeLink.apply(this, arguments));
    }.bind(this);
}
/**
 * Wrap an IDirectiveLinkFn or IDirectiveLinkFn in IDirectivePrePost with a function that modifies things before invocation.
 * @param originalLink
 * @returns {ng.IDirectiveLinkFn | ng.IDirectivePrePost}
 */
function linkWrapperFactory(originalLink, beforeLink) {
    let linkingConfig = identifyLinkingFn(originalLink);
    if (linkingConfig === LinkingInstructionType.fn) {
        return linkFnWrapperFactory.call(this, originalLink, beforeLink);
    }
    else if ((linkingConfig & LinkingInstructionType.pre) === LinkingInstructionType.pre) {
        let newLinkingObj = {};
        newLinkingObj.pre = linkFnWrapperFactory.call(this, originalLink.pre, beforeLink);
        newLinkingObj.post = originalLink.post;
        return newLinkingObj;
    }
    else if ((linkingConfig & LinkingInstructionType.post) === LinkingInstructionType.post) {
        let newLinkingObj = {};
        newLinkingObj.pre = originalLink.pre;
        newLinkingObj.post = linkFnWrapperFactory.call(this, originalLink.post, beforeLink);
        return newLinkingObj;
    }
    else {
        return originalLink;
    }
}
function compileWrapperFactory(originalCompileFn, beforeLink) {
    return function () {
        var linkObj = originalCompileFn.apply(this, arguments);
        return linkWrapperFactory.call(this, linkObj, beforeLink);
    }.bind(this);
}
/**
 * Adapter to angular 1 directives.
 * Wrapping a directive is done in several steps:
 * 1) Calling _directiveFactoryFactory() to create a directive recipe function and handling $inject.
 * 2) Calling _constructDirective() to create a DirectiveInstance & its Proxy.
 */
export class DirectiveAdapter extends BaseAdapter {
    register() {
        if (this.inst.component) {
            this._registerView(this.inst.component, this.inst.view);
        }
        else if (this.inst.directive) {
            this._registerNoView(this.inst.directive);
        }
    }
    /**
     * A Directive constructor emulator using a proxy.
     * Angular 2 is all about classes, this is why NGTT requires a directive to be a class.
     * Due to DI we cant just create new instance of the directive class, the injections wont pass.
     * Another thing to note is that NGTT use a DirectiveInstance class on top of the user's directive class.
     * In OOP terms DirectiveInstance extends User's Directive class, giving DirectiveInstance the ability to control the user's class.
     * To get this relation done we need a proxy, we can't do it directly on the type DirectiveInstance.
     * @param args
     * @returns {Component}
     * @private
     */
    _constructDirective(args) {
        function extend(type, base) {
            function __() { this.constructor = type; }
            __.prototype = base.prototype;
            type.prototype = new __();
        }
        // we cant extend DirectiveInstance directly since it will be used for many directives, instead we wrap it with a proxy.
        function DirectiveInstanceProxy(adapter, args) {
            DirectiveInstance.apply(this, [adapter, args]);
        }
        extend(DirectiveInstanceProxy, this.inst.cls);
        for (var k in DirectiveInstance.prototype) {
            DirectiveInstanceProxy.prototype[k] = DirectiveInstance.prototype[k];
        }
        return new DirectiveInstanceProxy(this, args); // typeof is DirectiveAdapter
    }
    /**
     * A Directive wrapper that
     * @returns {ng.IDirectiveFactory}
     * @private
     */
    _directiveFactoryFactory() {
        var factory = function (...args) {
            return this._constructDirective(args);
        }.bind(this);
        factory.$inject = this.inst.cls.$inject;
        return factory;
    }
    _registerNoView(cmpt) {
        this.inst.ngModule.directive(cmpt.selector, this._directiveFactoryFactory());
    }
    _registerView(cmpt, view) {
        if (view.template) {
            this.inst.cls.prototype.template = view.template;
        }
        else if (view.templateUrl) {
            this.inst.cls.prototype.templateUrl = view.templateUrl;
        }
        this.inst.ngModule.directive(cmpt.selector, this._directiveFactoryFactory());
    }
}
DirectiveAdapter.CORE_DIRECTIVE_EVENTS = 'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' ');
DirectiveAdapter.CORE_DIRECTIVE_EVENTS_FORCE_ASYNC = {
    'blur': true,
    'focus': true
};
/**
 * A directive DDO owner, manipulates the user directive according to needs.
 * There is one DirectiveInstance per Directive type (DDO).
 */
class DirectiveInstance {
    constructor(adapter, args) {
        this.adapter = adapter;
        this.$injector = angular.injector(['ng']);
        this.$rootScope = this.$injector.get('$rootScope');
        this.annotation = this.adapter.inst.directive || this.adapter.inst.component;
        adapter.inst.cls.apply(this, args);
        this.isControllerExists = angular.isFunction(this.controller);
        this.parseAnnotations();
        if (this.isControllerExists) {
            let ctrl = this.controller;
            this.controller = function () {
                return ctrl.apply(this, arguments);
            };
            this.controller.$inject = ctrl.$inject;
            // Force require so the controller in linkFn will always be an array with index 0 as the controller.
            if (angular.isArray(this.require)) {
                this.require.unshift(this.annotation.selector);
            }
            else if (this.require) {
                this.require = [this.annotation.selector, this.require];
            }
            else {
                this.require = [this.annotation.selector];
            }
        }
        // we want to control the linking function to support 'host' features in ng2
        // for this we need to wrap the "link" function or link.pre\post function
        if (angular.isFunction(this.compile)) {
            // compile returns a LinkFn so we will wait for it, grab & wrap.
            this.compile = compileWrapperFactory.call(this, this.compile, this.beforeLink);
        }
        else {
            this.link = linkWrapperFactory.call(this, this.link, this.beforeLink);
        }
    }
    // SEE https://github.com/angular/angular/blob/master/modules/angular2/src/render/api.ts#L161
    /**
     * Invoked before link is invoked (or link returned from a compile block)
     * This is a virtual place where a directive defines new instances of itself... (via scope/controller)
     * Must return an array of injectables sent to the original link.
     * @returns {string[]}
     */
    beforeLink(scope, iElement, iAttrs, controller, transclude) {
        var ctx = (this.isControllerExists) ? controller[0] : scope; // if we have a ctrl require is an array for sure.
        //events
        MapWrapper.forEach(this.hostListeners, (fn, eventName) => {
            iElement.on(eventName, function (event) {
                //TODO: this is good for CORE_DIRECTIVE_EVENTS, need to add logic for other events.
                var callback = function () {
                    fn(ctx, { $event: event });
                };
                if (DirectiveAdapter.CORE_DIRECTIVE_EVENTS_FORCE_ASYNC[eventName] && this.$rootScope.$$phase) {
                    scope.$evalAsync(callback);
                }
                else {
                    scope.$apply(callback);
                }
            }.bind(this));
        });
        //attributes
        MapWrapper.forEach(this.hostProperties, (fn, propName) => {
            scope.$watch(() => fn(ctx), function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    iElement.prop(propName, newVal);
                }
            });
        });
        //attributes
        MapWrapper.forEach(this.hostAttributes, (value, attrName) => {
            if (!iAttrs.hasOwnProperty(attrName)) {
                iElement.attr(camelToDash(attrName), value);
            }
        });
        // remove the first controller if we forced it by adding it the require list...
        if (this.isControllerExists) {
            if (controller.length === 1)
                controller = controller[0];
            else {
                controller.splice(0, 1);
            }
        }
        var ret = [scope, iElement, iAttrs];
        controller && ret.push(controller);
        transclude && ret.push(transclude);
        return ret;
    }
    parseAnnotations() {
        this.hostListeners = new Map();
        this.hostProperties = new Map();
        this.hostAttributes = new Map();
        this.hostActions = new Map();
        var $parse = this.$injector.get('$parse');
        var host = (this.annotation.host) ? MapWrapper.createFromStringMap(this.annotation.host) : null;
        if (isPresent(host)) {
            MapWrapper.forEach(host, (value, key) => {
                var matches = RegExpWrapper.firstMatch(DirectiveInstance._hostRegExp, key);
                if (isBlank(matches)) {
                    this.hostAttributes.set(key, value);
                }
                else if (isPresent(matches[1])) {
                    this.hostProperties.set(matches[1], $parse(value));
                }
                else if (isPresent(matches[2])) {
                    this.hostListeners.set(matches[2], $parse(value));
                }
                else if (isPresent(matches[3])) {
                    this.hostActions.set(matches[3], value);
                }
            });
        }
        if (this.isControllerExists && !this.controllerAs) {
            this.controllerAs = getTypeName(this.adapter.inst.cls);
        }
    }
}
// group 1: "property" from "[property]"
// group 2: "event" from "(event)"
// group 3: "action" from "@action"
DirectiveInstance._hostRegExp = /^(?:(?:\[([^\]]+)\])|(?:\(([^\)]+)\))|(?:@(.+)))$/g;
//# sourceMappingURL=directive.js.map