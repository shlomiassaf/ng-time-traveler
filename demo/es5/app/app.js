/**
 * Created by Shlomi on 08/09/2015.
 */

//ComponentFactory
angular.module('myApp', ['ngRoute']);

function AppComponent() {
    this.name = "Angular 1";
    this.nameTwo = "Angular 2";
}

AppComponent.annotations = [
    new ngtt.Component({
        selector: '',
        _ngtt: {
            ngApp: "myApp",
            ngRoute: {
                path: '/hello',
                controllerAs: "ctrl"
            }
        }
    }),
    new ngtt.View({
        template: '<h1>Hello {{ctrl.name}}</h1><hello></hello>'
    })
];
ngtt.register(AppComponent);

function AppDirective() {
    this.name = "Angular 1";
    this.nameTwo = "Angular 2";
}

AppDirective.annotations = [
    new ngtt.Component({
        selector: 'hello',
        _ngtt: {
            ngApp: "myApp"
        }
    }),
    new ngtt.View({
        template: '<h1>Hello DIRECTIVE {{ctrl.name}}</h1>'
    })
];
ngtt.register(AppDirective);

function stam() {
    return {
        template: '<h2>STAM!!!</h2>',
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$transclude', '$http', function ($scope, $element, $attrs, $transclude) {
            console.log(arguments[4]);
        }]

    }
}

angular.module('myApp').directive('stam', stam);
