/// <reference path="../../../typings/tsd.d.ts" />
'use strict';
var ngtt_1 = require("../../../src/ngtt");
ngtt_1.config.ngApp = "myApp-WithTypeO"; // a fake name, with intent, we will set the real name in each directive.
angular.module('myApp', ['ngRoute']);
require('./components/component'); //import {MyHomePage} from './components/component';
require('./components/directive'); //import {ViewLess} from './components/directive';
require('./components/directiveWithView'); //import {ViewMore} from './components/directiveWithView';
//# sourceMappingURL=app.js.map