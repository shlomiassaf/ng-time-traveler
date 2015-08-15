/// <reference path="../../../typings/tsd.d.ts" />
import { ViewAnnotation } from './view';
import { DirectiveAnnotation, ComponentAnnotation } from './annotations';
import { makeDecorator } from '../../util/decorators';
/**
 * {@link Component} factory function.
 */
export var Component = makeDecorator(ComponentAnnotation, (fn) => fn.View = View);
/**
 * {@link Directive} factory function.
 */
export var Directive = makeDecorator(DirectiveAnnotation);
export var View = makeDecorator(ViewAnnotation, (fn) => fn.View = View);
//# sourceMappingURL=decorators.js.map