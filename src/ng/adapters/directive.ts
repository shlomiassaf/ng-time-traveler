/// <reference path="../../../typings/tsd.d.ts" />

import {IAdapter, RegisterInstruction} from "../adapterManager";
import {getTypeName, StringMap} from "../../facade/lang";
import {BaseAdapter} from "./base";
import {Directive, Component} from '../../core/annotations_impl/annotations';
import {View} from '../../core/annotations_impl/view';

export interface IDirective extends ng.IDirective{
    $$ngtt: {
        adapter: DirectiveAdapter
    }
}

export enum LinkingInstructionType {
    fn = 1,
    pre = 2,
    post = 4
}

export enum HostItemType {
    event,
    property,
    attribute,
    action,
    invalid
}

function getHostType(name: string): HostItemType {
    var result: HostItemType;

    if (!name) {
        result = HostItemType.invalid;
    }
    else {
        let [first, last] = [name.substr(0, 1), name.substr(name.length-1, 1)];
        if (first === "@"){
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
function identifyLinkingFn(linkObj): number {
    let fn,
        result: number = 0;

    if(linkObj) {
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

function linkFnWrapperFactory(originalLinkFn, beforeLink: ng.IDirectiveLinkFn) {
    return function() {
        beforeLink.apply(this, arguments);
        return originalLinkFn.apply(this, arguments);
    }.bind(this);
}


/**
 * Wrap an IDirectiveLinkFn or IDirectiveLinkFn in IDirectivePrePost with a function that modifies things before invocation.
 * @param originalLink
 * @returns {ng.IDirectiveLinkFn | ng.IDirectivePrePost}
 */
function linkWrapperFactory(originalLink: ng.IDirectiveLinkFn | ng.IDirectivePrePost,
                            beforeLink: ng.IDirectiveLinkFn): ng.IDirectiveLinkFn | ng.IDirectivePrePost {

    let linkingConfig: number = identifyLinkingFn(originalLink);

    if (linkingConfig === LinkingInstructionType.fn) {
        return linkFnWrapperFactory.call(this, originalLink, beforeLink);
    }
    else if( (linkingConfig & LinkingInstructionType.pre) === LinkingInstructionType.pre) {
        let newLinkingObj: ng.IDirectivePrePost = {};
        newLinkingObj.pre = linkFnWrapperFactory.call(this, (<ng.IDirectivePrePost>originalLink).pre, beforeLink);
        newLinkingObj.post = (<ng.IDirectivePrePost>originalLink).post;
        return newLinkingObj;
    }
    else if( (linkingConfig & LinkingInstructionType.post) === LinkingInstructionType.post) {
        let newLinkingObj: ng.IDirectivePrePost = {};
        newLinkingObj.pre =  (<ng.IDirectivePrePost>originalLink).pre;
        newLinkingObj.post = linkFnWrapperFactory.call(this, (<ng.IDirectivePrePost>originalLink).post, beforeLink);
        return newLinkingObj;
    }
    else {
        return originalLink;
    }
}

function compileWrapperFactory(originalCompileFn, beforeLink: ng.IDirectiveLinkFn) {
    return function() {
        var linkObj = originalCompileFn.apply(this, arguments);
        return linkWrapperFactory.call(this, linkObj, beforeLink);
    }.bind(this);
}


export class DirectiveAdapter extends BaseAdapter implements IAdapter{

    public hostMeta: {
        events: StringMap<string, string>,
        properties: StringMap<string, string>,
        attributes: StringMap<string, string>,
        actions: StringMap<string, string>
    };

    private _populateHostMeta(host: StringMap<string, string>) {
        this.hostMeta = {
            events: {},
            properties: {},
            attributes: {},
            actions: {}
        };
        if (host) {
            for (var k in host) {
                var hostType: HostItemType = getHostType(k);
                switch (hostType) {
                    case HostItemType.action:
                        this.hostMeta.actions[k.substr(1)] = host[k];
                        break;
                    case HostItemType.property:
                        this.hostMeta.properties[k.substr(1, k.length - 2)] = host[k];
                        break;
                    case HostItemType.event:
                        this.hostMeta.events[k.substr(1, k.length - 2)] = host[k];
                        break;
                    case HostItemType.attribute:
                        this.hostMeta.attributes[k] = host[k];
                        break;
                }
            }
        }
    }

    register() {

        if (this.inst.component) {
            this._populateHostMeta(this.inst.component.host);
            this._registerView(this.inst.component, this.inst.view);
        }
        else if (this.inst.directive) {
            this._populateHostMeta(this.inst.directive.host);
            this._registerNoView(this.inst.directive);
        }
    }


    private _beforeLink( scope: ng.IScope, iElement: ng.IAugmentedJQuery, iAttrs: ng.IAttributes,
                         controller: any, transclude: ng.ITranscludeFunction) {

        // The actual place when are on an instance level of a directive.
        // All other places instances of a directive type.
        // Here we have virtual constructor to an instance of a directive.
        // the context ("this") is the a "Component" instance, the only instance of Component for this directive as a type.

        var self = <IDirective><any>this;

        for (var k in self.$$ngtt.adapter.hostMeta.events) {

        }

        //console.log(this);
        //console.log(controller);
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
    private _constructDirective(args): ng.IDirective {
        function Component(adapter: DirectiveAdapter, args: any[])  {
            adapter.inst.cls.apply(this, args);
            this.$$ngtt = {
                adapter: adapter
            };

            if (angular.isFunction(this.controller)) {
                let ctrl = this.controller;
                this.controller = function() {
                    return ctrl.apply(this, arguments);
                };
                this.controller.$inject = ctrl.$inject;
            }

            // we want to control the linking function to support 'host' features in ng2
            // for this we need to wrap the "link" function or link.pre\post function
            if (angular.isFunction(this.compile)) {
                // compile returns a LinkFn so we will wait for it, grab & wrap.
                this.compile = compileWrapperFactory.call(this, this.compile, adapter._beforeLink);
            }
            else {
                // direct wrap.
                this.link = linkWrapperFactory.call(this, this.link, adapter._beforeLink);
            }
        }
        Component.prototype = this.inst.cls.prototype;
        return new Component(this, args);
    }


    private _directiveFactoryFactory(): ng.IDirectiveFactory {
        var factory:ng.IDirectiveFactory = function(...args: any[]): ng.IDirective {
            return this._constructDirective(args);
        }.bind(this);
        factory.$inject = this.inst.cls.$inject;

        return factory;
    }

    private _registerNoView(cmpt: Directive) {
        this.inst.ngModule.directive(cmpt.selector, this._directiveFactoryFactory());
    }

    private _registerView(cmpt: Component, view: View) {

        if (view.template) {
            this.inst.cls.prototype.template = view.template;
        }
        else if (view.templateUrl) {
            this.inst.cls.prototype.templateUrl = view.templateUrl;
        }

        this.inst.ngModule.directive(cmpt.selector, this._directiveFactoryFactory());
    }
}