export {ViewMetadata} from './metadata/view';

export {
    INgttAnnotationMeta,
    INgRouteMeta,
    ComponentMetadata,
    DirectiveMetadata
} from './metadata/directives';

import {
    ComponentMetadata,
    DirectiveMetadata,
} from './metadata/directives';


import {ViewMetadata} from './metadata/view';

import {makeDecorator, makeParamDecorator, TypeDecorator, Class} from '../util/decorators';
import {Type} from '../facade/lang';

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
        host?: StringMap<string, string>,
        _ngtt?: INgttAnnotationMeta
    }): DirectiveDecorator;
    new (obj: {
        selector?: string,
        host?: StringMap<string, string>,
        _ngtt?: INgttAnnotationMeta
    }): DirectiveMetadata;
}

export interface ComponentFactory {
    (obj: {
        selector?: string,
        host?: StringMap<string, string>,
        _ngtt?: INgttAnnotationMeta
    }): DirectiveDecorator;
    new (obj: {
        selector?: string,
        host?: StringMap<string, string>,
        _ngtt?: INgttAnnotationMeta
    }): ComponentMetadata;
}

export interface ViewFactory {
    (obj: {
        templateUrl?: string | StringFunc,
        template?: string | StringFunc,
    }): ViewDecorator;
    new (obj: {
        templateUrl?: string | StringFunc,
        template?: string | StringFunc,
    }): ViewMetadata;
}

/**
 * {@link Component} factory function.
 */
export var Component: ComponentFactory =
    <ComponentFactory>makeDecorator(ComponentMetadata, (fn: any) => fn.View = View);

/**
 * {@link Directive} factory function.
 */
export var Directive: DirectiveFactory = <DirectiveFactory>makeDecorator(DirectiveMetadata);

export var View: ViewFactory =
    <ViewFactory>makeDecorator(ViewMetadata, (fn: any) => fn.View = View);
