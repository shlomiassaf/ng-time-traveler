# ng-time-traveler

A first attempt on a POC package that enables defining angular 1 components & directives using angular 2 syntax.

## Notes:
  - Enable gradual implementation, e.g: build some of your directives/controllers in angular 2 syntex while the rest in angular 1 syntax.
  - Built with extensibility in mind (modules can be replaced enabling, for example, use of the "new router" adapter instead of the existing "ngRoute" adapter)...
  - Use angular 2 logic (for metadata, etc...) as much as possible.
 
## Path to ng2.
`ngtt` requires you to use classes (or supply a constructor function) for your controllers & directives.
This is mandatory at the moment as this is what you will have to use in ng2, support for non-instance DDL object is possible but not implemented.

Angular 2 has 3 main elements that Angular 1 directives & controllers should match to:
  - Directive
  - Component
  - View
  
### Special metadata property `_ngtt`:
`_ngtt` is a special metadata property in `@Directive` (hence in @Component as well) that provides external metadata to `ngtt` runtime.
The external metadata is needed to cover the gap between ng1 & ng2.


### General mapping:
An angular 1 directive __without__ a template will use angular 2 `@Directive` metadata instruction.
An angular 1 directive __with__ a template will use angular 2 `@Component` & `@View` metadata instructions and supply a `selector`
An angular 1 controller/template combination will use angular 2 `@Component` & `@View` metadata instructions and omit the `selector`

See examples for more control options.

## Current support:
  - Angular 1 controller/template is supported via ngRouter (big TODO is implement the `new router`)
  - Angular 1 directive is supported (with or without a template).
  
  @Directive syntax supports host: events, properties and attributes.
  
  See the quick tour for mapping samples.
  
## Quick tour:

### Init the app:
`ngtt` should load after angular core modules are loaded and before app modules/files are loaded.

```
'use strict';
import {config} from 'ngtt';

// notify ngtt of the ng-app name, this is a global instruction, you can set it per directive/component as well.
config.ngApp = "myApp-With-A-TypeO";

angular.module('myApp', ['ngRoute']);

// now load other application files...
```

### A page (controller/template in ng-route) in the app:
```
'use strict';
import {View, Component, Directive, config} from 'ngtt';

@Component({
    selector: '', // must omit or empty
    _ngtt: {
        ngApp: "myApp", // define the app per component/directive
        ngRoute: { // ngRoute extension 
            path: '/hello',
            controllerAs: "ctrl"
        }
    }
})
@View({
    template: "<h1>Hello {{ctrl.world}}</h1>" // or templateUrl:
})
export class HellowWorldController{
    name: string;
    static $inject = [];
    constructor() {
        this.world = "Angular1";
    }
}
```

### A templateless directive
```
'use strict';
import {View, Component, Directive, config} from 'ngtt';

@Directive({
    selector: 'simpleDirective' // use simple-directive in html markup to invoke this directive.
    // _ngtt.ngApp not defined, will use the definition in ngtt config.
})
export class ViewLess{
    restrict: string = 'EA';

    constructor() {
    }

    link(scope, iElement, iAttrs, controller) {
        iElement.html('<h1>Hello Directive header! :)</h1>');
    }
}
```

### A directive with a template
``` 
'use strict';
import {View, Component, Directive, config} from 'ngtt';

@Component({
    selector: 'myDirective',
    host: {
        '(click)': 'onClick($event)',
        '[text]': 'ngTemp',     
        'rule': 'nothing'
    },
    _ngtt: {
        ngApp: "myApp"
    }
})
@View({
    template: "<span>Hello Directive {{name}}</span>"
})
export class ComponentLike{
    static $inject = [];

    restrict: string = 'EA';

    constructor() {
    }


    controllerAs = "ctrl123"; // will default to class name if not supplied but a controller property exists...
    controller: Function = viewMoreController

    scope = {
        name: '=name'
    };

    bindToController = true;
 
    link(scope, iElement, iAttrs, controller) {
        // do something...
    }
}

function ComponentLikeController($scope, $element, $attrs, $transclude, otherInjectables,) {
    var self = this;

    this.hasScope = ($scope) ? true : false;

    this.onClick = function($event) {
        self.ngTemp = "1422";
        alert(self.ngTemp);
    }
}
ComponentLikeController.$inject = ['$scope'];
```
Note that `ComponentLikeController` is the actual component in Angular 2, in most cases it is better to write
the login within `ComponentLikeController`.


## TODO:
  - Check performance
  - Explore supporting property & events for @Component
  - Test that ES5 is working (ES5 DSL & ES5 annotation)
  - Create demo app in ES5
  - Support events other then core directive events.
  - refactor `index.html`
  - refactor package.json (a lot of garbage)
  - refactor code structure, especially in src/ng
  - Build a `component router` adapter to get closer to almost perfect compatibility to ng2.
  - More...
  

> This is a first attempt, code transpiles on the browser for now, now ES5 output build yet.

## Install:
  - Clone repo.
  - `npm install`
  - `bower install` TODO: Remove bower for webpack
  

## Run:
  - `npm start`
  - browse to: http://localhost:55000/

## Repo structure:
Currently, no unit tests.
`app` directory contains a demo app that shows the ability (TypeScript code demo for now).
`src` directory contains `ng-time-traveler`
`index.html`