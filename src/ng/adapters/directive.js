/// <reference path="../../../typings/tsd.d.ts" />
import { getTypeName, camelToDash } from "../../facade/lang";
import { BaseAdapter } from "./base";
export var LinkingInstructionType;
(function (LinkingInstructionType) {
    LinkingInstructionType[LinkingInstructionType["fn"] = 1] = "fn";
    LinkingInstructionType[LinkingInstructionType["pre"] = 2] = "pre";
    LinkingInstructionType[LinkingInstructionType["post"] = 4] = "post";
})(LinkingInstructionType || (LinkingInstructionType = {}));
export var HostItemType;
(function (HostItemType) {
    HostItemType[HostItemType["event"] = 0] = "event";
    HostItemType[HostItemType["property"] = 1] = "property";
    HostItemType[HostItemType["attribute"] = 2] = "attribute";
    HostItemType[HostItemType["action"] = 3] = "action";
    HostItemType[HostItemType["invalid"] = 4] = "invalid";
})(HostItemType || (HostItemType = {}));
function getHostType(name) {
    var result;
    if (!name) {
        result = HostItemType.invalid;
    }
    else {
        let [first, last] = [name.substr(0, 1), name.substr(name.length - 1, 1)];
        if (first === "@") {
            result = (name.length > 1) ? HostItemType.action : HostItemType.invalid;
        }
        else {
            if (first === "[" && last === "]") {
                result = (name.length > 2) ? HostItemType.property : HostItemType.invalid;
            }
            else if (first === "(" && last === ")") {
                result = (name.length > 2) ? HostItemType.event : HostItemType.invalid;
            }
            else {
                result = HostItemType.attribute;
            }
        }
    }
    return result;
}
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
     * A Directive constructor emulator.
     * Why? Since Directive`s are plain objects (not instances) they are no good for NGTT,
     * NGTT enforce directives as Classes so they can be instantiated, this is to future proof them for NG2 as much as possible.
     * To compose a directive per its annotations it must be modified before sent to angular, also angular does not instantiate directives (creating them with new)
     * Angular is all about DI so it will send some injections, we need to make sure they will get to the Class constructor.
     * Since its a class and it requires instantiation (new) we need to work around that (there is no "apply" to new XXX()).
     * Also, while at it, some modifications are made to support complex annotations.
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
        this.annotation = this.adapter.inst.directive || this.adapter.inst.component;
        adapter.inst.cls.apply(this, args);
        this.isControllerExists = angular.isFunction(this.controller);
        this.hostMeta = {
            events: {},
            coreEvents: {},
            properties: {},
            attributes: {},
            actions: {}
        };
        this.host = {
            events: undefined,
            coreEvents: undefined,
            properties: undefined,
            actions: undefined
        };
        this.parseAnnotations();
        var $injector = angular.injector(['ng']);
        var $parse = $injector.get('$parse');
        this.$rootScope = $injector.get('$rootScope');
        this.host.coreEvents = [];
        for (var k in this.hostMeta.coreEvents) {
            this.host.coreEvents.push({
                eventName: k,
                fn: $parse(this.hostMeta.coreEvents[k], null, true)
            });
        }
        this.host.events = [];
        for (var k in this.hostMeta.events) {
            this.host.events.push({
                eventName: k,
                fn: $parse(this.hostMeta.events[k], null, true)
            });
        }
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
    populateHostMeta(host) {
        if (host) {
            for (var k in host) {
                var hostType = getHostType(k);
                switch (hostType) {
                    case HostItemType.action:
                        this.hostMeta.actions[k.substr(1)] = host[k];
                        break;
                    case HostItemType.property:
                        this.hostMeta.properties[k.substr(1, k.length - 2)] = host[k];
                        break;
                    case HostItemType.event:
                        var eName = k.substr(1, k.length - 2);
                        if (DirectiveAdapter.CORE_DIRECTIVE_EVENTS.indexOf(eName)) {
                            this.hostMeta.coreEvents[eName] = host[k];
                        }
                        else {
                            this.hostMeta.events[eName] = host[k];
                        }
                        break;
                    case HostItemType.attribute:
                        this.hostMeta.attributes[k] = host[k];
                        break;
                }
            }
        }
    }
    updateHostAttributes(element, attrs) {
        for (var attrName in this.hostMeta.attributes) {
            if (!attrs.hasOwnProperty(attrName)) {
                element.attr(camelToDash(attrName), this.hostMeta.attributes[attrName]);
            }
        }
    }
    /**
     * Invoked before link is invoked (or link returned from a compile block)
     * This is a virtual place where a directive defines new instances of itself... (via scope/controller)
     * Must return an array of injectables sent to the original link.
     * @returns {string[]}
     */
    beforeLink(scope, iElement, iAttrs, controller, transclude) {
        var ctx = (this.isControllerExists) ? controller[0] : scope; // if we have a ctrl require is an array for sure.
        for (var v of this.host.coreEvents) {
            iElement.on(v.eventName, function (event) {
                var callback = function () {
                    v.fn(ctx, { $event: event });
                };
                if (DirectiveAdapter.CORE_DIRECTIVE_EVENTS_FORCE_ASYNC[v.eventName] && this.$rootScope.$$phase) {
                    scope.$evalAsync(callback);
                }
                else {
                    scope.$apply(callback);
                }
            });
        }
        for (var v of this.host.events) {
            iElement.on(v.eventName, function (event) {
                var callback = function () {
                    v.fn(ctx, { $event: event }); // TODO: this is not good...
                };
                scope.$apply(callback);
            });
        }
        this.updateHostAttributes(iElement, iAttrs);
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
        this.populateHostMeta(this.annotation.host);
        if (this.isControllerExists && !this.controllerAs) {
            this.controllerAs = getTypeName(this.adapter.inst.cls);
        }
    }
}
//# sourceMappingURL=directive.js.map