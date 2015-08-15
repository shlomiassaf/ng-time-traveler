/// <reference path="../../../typings/tsd.d.ts" />

/* SEE: https://github.com/angular/angular/blob/master/modules/angular2/src/core/annotations/decorators.ts */

import {ViewAnnotation} from './view';
import {DirectiveAnnotation, ComponentAnnotation, INgttAnnotationMeta} from './annotations';
import {makeDecorator, makeParamDecorator, TypeDecorator, Class} from '../../util/decorators';
import {Type} from '../../facade/lang';
import {StringFunc} from '../../ng/typings';

export interface DirectiveDecorator  extends TypeDecorator {}

/**
 * Interface for the {@link Component} decorator function.
 *
 * See {@link ComponentFactory}.
 */
export interface ComponentDecorator extends TypeDecorator {
    /**
     * Chain {@link View} annotation.
     */
    View(obj: {
        templateUrl?: string | StringFunc,
        template?: string | StringFunc,
        _ngtt?: INgttAnnotationMeta,
    }): ViewDecorator;
}

export interface ViewDecorator extends TypeDecorator {
    /**
     * Chain {@link View} annotation.
     */
    View(obj: {
        templateUrl?: string | StringFunc,
        template?: string | StringFunc,
    }): ViewDecorator;
}

export interface DirectiveFactory {
    (obj: {
        selector?: string,
        _ngtt?: INgttAnnotationMeta
    }): DirectiveDecorator;
    new (obj: {
        selector?: string,
        _ngtt?: INgttAnnotationMeta
    }): DirectiveAnnotation;
}

export interface ComponentFactory {
    (obj: {
        selector?: string,
        _ngtt?: INgttAnnotationMeta
    }): DirectiveDecorator;
    new (obj: {
        selector?: string,
        _ngtt?: INgttAnnotationMeta
    }): DirectiveAnnotation;
}

export interface ViewFactory {
    (obj: {
        templateUrl?: string | StringFunc,
        template?: string | StringFunc,
    }): ViewDecorator;
    new (obj: {
        templateUrl?: string | StringFunc,
        template?: string | StringFunc,
    }): ViewAnnotation;
}

/**
 * {@link Component} factory function.
 */
export var Component: ComponentFactory =
    <ComponentFactory>makeDecorator(ComponentAnnotation, (fn: any) => fn.View = View);

/**
 * {@link Directive} factory function.
 */
export var Directive: DirectiveFactory = <DirectiveFactory>makeDecorator(DirectiveAnnotation);

export var View: ViewFactory =
    <ViewFactory>makeDecorator(ViewAnnotation, (fn: any) => fn.View = View);
