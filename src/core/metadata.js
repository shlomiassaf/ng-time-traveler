/// <reference path="../../typings/tsd.d.ts" />
export { ViewMetadata } from './metadata/view';
export { ComponentMetadata, DirectiveMetadata } from './metadata/directives';
import { ComponentMetadata, DirectiveMetadata } from './metadata/directives';
import { ViewMetadata } from './metadata/view';
import { makeDecorator } from '../util/decorators';
/**
 * {@link Component} factory function.
 */
export var Component = makeDecorator(ComponentMetadata, (fn) => fn.View = View);
/**
 * {@link Directive} factory function.
 */
export var Directive = makeDecorator(DirectiveMetadata);
export var View = makeDecorator(ViewMetadata, (fn) => fn.View = View);
//# sourceMappingURL=metadata.js.map