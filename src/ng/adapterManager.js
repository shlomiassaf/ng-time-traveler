import { hasModule, notifyOnNewModule } from '../ngDecorator';
import * as config from '../ng/config';
import { getTypeName } from "../ng/util";
var adapters = {};
/**
 * Types of annotations angular2 provides.
 */
export var AnnotationType;
(function (AnnotationType) {
    AnnotationType[AnnotationType["DirectiveMetadata"] = 1] = "DirectiveMetadata";
    AnnotationType[AnnotationType["ComponentMetadata"] = 2] = "ComponentMetadata";
    AnnotationType[AnnotationType["ViewMetadata"] = 4] = "ViewMetadata";
})(AnnotationType || (AnnotationType = {}));
/**
 * Types of UI components angularJS provides.
 */
export var AngularLegacyViewType;
(function (AngularLegacyViewType) {
    AngularLegacyViewType[AngularLegacyViewType["Controller"] = 1] = "Controller";
    AngularLegacyViewType[AngularLegacyViewType["Directive"] = 2] = "Directive";
    AngularLegacyViewType[AngularLegacyViewType["Routing"] = 3] = "Routing";
})(AngularLegacyViewType || (AngularLegacyViewType = {}));
/**
 * Finds an annotation instance by its "type" name.
 * @param annotations
 * @param name
 * @returns {any}
 */
export function findAnnotation(annotations, name) {
    for (var i = 0; i < annotations.length; i++) {
        if (name === getTypeName(annotations[i]))
            return annotations[i];
    }
    return null;
}
export function registerAdapter(adapterClass, legacyView) {
    if (!adapterClass || !legacyView)
        return;
    var lv;
    if (!Number.isNaN(Number(legacyView))) {
        lv = AngularLegacyViewType[legacyView];
    }
    else {
        lv = (AngularLegacyViewType.hasOwnProperty(legacyView)) ? legacyView : null;
    }
    if (lv) {
        adapters[lv] = adapterClass;
    }
    else {
        throw new Error("Unknown legacy view " + legacyView);
    }
}
export function registerLegacy(cls, annotations) {
    var instruction = new RegisterInstruction(cls, annotations);
    mgr.add(instruction);
}
export class RegisterInstruction {
    constructor(cls, annotations) {
        this._cache = {};
        this.cls = cls;
        this.annotations = annotations;
    }
    /**
     * Flatten (reduce) and array of annotations to a bit flag of AnnotationType.
     * @param annotations
     * @returns {number}
     */
    _flatten() {
        var flatValue = 0;
        for (var i = 0; i < this.annotations.length; i++) {
            var name = getTypeName(this.annotations[i]);
            if (AnnotationType.hasOwnProperty(name)) {
                flatValue = flatValue | AnnotationType[name];
            }
        }
        return flatValue;
    }
    _mapAnnotationsToLegacyView() {
        var annotationFlag = this._flatten();
        var map;
        switch (annotationFlag) {
            case 1:
                map = AngularLegacyViewType.Directive;
                break;
            case 6: {
                var cmpAnnotation = findAnnotation(this.annotations, AnnotationType[2]);
                map = (cmpAnnotation && cmpAnnotation.selector && typeof cmpAnnotation.selector === "string") ?
                    AngularLegacyViewType.Directive : AngularLegacyViewType.Controller;
                break;
            }
        }
        return map;
    }
    destroy() {
        this._cache = undefined;
    }
    get legacyViewType() {
        if (!this._cache.hasOwnProperty('legacyViewType')) {
            var mapped = this._mapAnnotationsToLegacyView();
            if (mapped) {
                this._cache.legacyViewType = mapped;
            }
        }
        return this._cache.legacyViewType;
    }
    get directive() {
        if (!this._cache.hasOwnProperty('Directive')) {
            var value = findAnnotation(this.annotations, AnnotationType[AnnotationType.DirectiveMetadata]);
            if (value) {
                this._cache.Directive = value;
            }
            else {
                return null;
            }
        }
        return this._cache.Directive;
    }
    get component() {
        if (!this._cache.hasOwnProperty('Component')) {
            var value = findAnnotation(this.annotations, AnnotationType[AnnotationType.ComponentMetadata]);
            if (value) {
                this._cache.Component = value;
            }
            else {
                return null;
            }
        }
        return this._cache.Component;
    }
    get view() {
        if (!this._cache.hasOwnProperty('View')) {
            var value = findAnnotation(this.annotations, AnnotationType[AnnotationType.ViewMetadata]);
            if (value) {
                this._cache.View = value;
            }
            else {
                return null;
            }
        }
        return this._cache.View;
    }
    get ngAppName() {
        if (!this._cache.hasOwnProperty('ngAppName')) {
            var a = this.component || this.directive;
            var meta = (a) ? a._ngtt : undefined;
            this._cache.ngAppName = (meta && meta.ngApp) ? meta.ngApp : config.ngApp;
        }
        return this._cache.ngAppName || null;
    }
    get ngModule() {
        return angular.module(this.ngAppName);
    }
}
export class Mgr {
    constructor() {
        this.instructions = [];
    }
    onNewModuleAdded(name) {
        for (let i = this.instructions.length - 1; i >= 0; i--) {
            if (this.instructions[i].ngAppName == name) {
                this.register(this.instructions.pop());
            }
        }
    }
    add(inst) {
        if (hasModule(inst.ngAppName)) {
            this.register(inst);
        }
        else {
            // search if we have the class, since 2 decorators will invoke twice...
            for (let i = 0; i < this.instructions.length; i++) {
                if (this.instructions[i].cls === inst.cls) {
                    this.instructions.splice(i, 1);
                    break;
                }
            }
            this.instructions.push(inst);
        }
    }
    register(inst) {
        if (!inst.legacyViewType) {
            /*  TODO: save in a list, after angular is finished loading, display it.
             this is because we run register for every annotation.
             e.g: View + Component will run once for view which is invalid but 2nd time as a valid combination.
             */
            console.warn("Annotation implementation for " + getTypeName(inst.cls) + " is invalid - component skipped.");
            return;
        }
        var handler = adapters[AngularLegacyViewType[inst.legacyViewType]];
        if (!handler) {
            console.warn("Could not find an adapter of type '" + AngularLegacyViewType[inst.legacyViewType] + "' to handle '" + getTypeName(inst.cls) + "' - component skipped.");
            return;
        }
        new handler(inst).register();
        handler = adapters[AngularLegacyViewType[AngularLegacyViewType.Routing]];
        if (!handler) {
            return;
        }
        new handler(inst).register();
        //inst.destroy(); <- doesnt work, causes exception because the _cache is still needed after this.
        //TODO: attach a function to the "run" block of an angular module and remove per run invocation for the specific recipes of that run.
    }
}
var mgr = new Mgr();
notifyOnNewModule(mgr);
//# sourceMappingURL=adapterManager.js.map