/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
import {init} from './ngDecorator';
import * as _config from './ng/config';

export * from './core';
export * from './util';
export var config = _config;


import {registerAdapter, AngularLegacyViewType} from './ng/adapterManager';
import {ControllerAdapter, DirectiveAdapter, NgRouteAdapter} from './ng/adapters/adapters';

registerAdapter(ControllerAdapter, AngularLegacyViewType.Controller);
registerAdapter(DirectiveAdapter, AngularLegacyViewType.Directive);
registerAdapter(NgRouteAdapter, AngularLegacyViewType.Routing);

init();

