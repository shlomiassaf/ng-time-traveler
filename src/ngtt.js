/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import { init } from './ngDecorator';
import * as _config from './ng/config';
export { Component, Directive, View } from './core/annotations/decorators';
export { Class } from './util/decorators';
export var config = _config;
import { registerAdapter, AngularLegacyViewType } from './ng/adapterManager';
import { ControllerAdapter, DirectiveAdapter, NgRouteAdapter } from './ng/adapters/adapters';
registerAdapter(ControllerAdapter, AngularLegacyViewType.Controller);
registerAdapter(DirectiveAdapter, AngularLegacyViewType.Directive);
registerAdapter(NgRouteAdapter, AngularLegacyViewType.Routing);
init();
//# sourceMappingURL=ngtt.js.map