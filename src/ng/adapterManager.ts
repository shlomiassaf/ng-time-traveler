/// <reference path="../../typings/tsd.d.ts" />
import {hasModule, INewAngularModuleNotifier, notifyOnNewModule} from '../ngDecorator';
import {DirectiveMetadata, ComponentMetadata, ViewMetadata, INgttAnnotationMeta} from '../core/metadata';
import * as config from '../ng/config';
import {getTypeName} from "../facade/lang";

interface IAdapterDictionary {
    [index: string]: IAdapterStatic;
}

var adapters:IAdapterDictionary = {};

/**
 * Types of annotations angular2 provides.
 */
export enum AnnotationType {
    DirectiveMetadata = 1,
    ComponentMetadata = 2,
    ViewMetadata = 4
}

/**
 * Types of UI components angularJS provides.
 */
export enum AngularLegacyViewType {
    Controller = 1,
    Directive = 2,
    Routing = 3
}

/**
 * Finds an annotation instance by its "type" name.
 * @param annotations
 * @param name
 * @returns {any}
 */
export function findAnnotation(annotations: any[], name: string): any {
    for (var i=0; i<annotations.length; i++) {
        if (name === getTypeName(annotations[i])) return annotations[i];
    }
    return null;
}


export interface IAdapter {
    register();
}
export interface IAdapterStatic{
    new(inst: RegisterInstruction): IAdapter;
}

export function registerAdapter(adapterClass: IAdapterStatic, legacyView: AngularLegacyViewType){
    if (!adapterClass || !legacyView) return;


    var lv: string
    if(!Number.isNaN(Number(legacyView))) {
        lv  = AngularLegacyViewType[legacyView];
    }
    else { // in case someone sent the string (e.g: 'Directive') and not the enum...
        lv = (AngularLegacyViewType.hasOwnProperty(legacyView)) ? <any>legacyView : null;
    }



    if (lv) {
        adapters[lv] = adapterClass;
    }
    else {
        throw new Error("Unknown legacy view " + legacyView);
    }
}

export function registerLegacy(cls: any, annotations: any[]) {
    var instruction: RegisterInstruction = new RegisterInstruction(cls, annotations);
    mgr.add(instruction);
}

export class RegisterInstruction {
    private _cache:any = {};
    public annotations: any[];
    public cls;

    constructor(cls, annotations: any[]) {
        this.cls = cls;
        this.annotations = annotations;
    }

    /**
     * Flatten (reduce) and array of annotations to a bit flag of AnnotationType.
     * @param annotations
     * @returns {number}
     */
    private _flatten(): number {
        var flatValue:number = 0;

        for (var i=0; i < this.annotations.length; i++) {
            var name = getTypeName(this.annotations[i]);

            if (AnnotationType.hasOwnProperty(name)) {
                flatValue = flatValue | <any>AnnotationType[name];
            }
        }

        return flatValue;
    }

    private _mapAnnotationsToLegacyView(): AngularLegacyViewType {
        var annotationFlag: number = this._flatten();
        var map: AngularLegacyViewType;

        switch (annotationFlag) {
            case 1:
                map = AngularLegacyViewType.Directive;
                break;
            case 6: {
                var cmpAnnotation: ComponentMetadata = findAnnotation(this.annotations, AnnotationType[2]);
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

    get legacyViewType(): AngularLegacyViewType {
        if (!this._cache.hasOwnProperty('legacyViewType')) {
            var mapped = this._mapAnnotationsToLegacyView();
            if (mapped) {
                this._cache.legacyViewType = mapped;
            }
        }
        return this._cache.legacyViewType;
    }

    get directive(): DirectiveMetadata {
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

    get component(): ComponentMetadata {
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

    get view(): ViewMetadata {
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

    get ngAppName(): string {
        if (!this._cache.hasOwnProperty('ngAppName')) {
            var a = this.component || this.directive;
            var meta: INgttAnnotationMeta = (a) ? a._ngtt : undefined;
            this._cache.ngAppName = (meta && meta.ngApp) ? meta.ngApp : config.ngApp;
        }
       return this._cache.ngAppName || null;
    }

    get ngModule(): ng.IModule {
        return angular.module(this.ngAppName);
    }
}



export class Mgr implements INewAngularModuleNotifier{
    private instructions: RegisterInstruction[];

    constructor() {
        this.instructions = [];
    }

    onNewModuleAdded(name: string) {
        for (let i=this.instructions.length-1; i>=0; i--) {
            if (this.instructions[i].ngAppName == name) {
                this.register(this.instructions.pop());
            }
        }
    }

    add(inst: RegisterInstruction) {
        if (hasModule(inst.ngAppName)) {
            this.register(inst);
        }
        else {
            // search if we have the class, since 2 decorators will invoke twice...
            for (let i=0; i<this.instructions.length; i++){
                if (this.instructions[i].cls === inst.cls) {
                    this.instructions.splice(i, 1);
                    break;
                }
            }
            this.instructions.push(inst);
        }
    }

    register(inst: RegisterInstruction) {
        if (!inst.legacyViewType) {
            /*  TODO: save in a list, after angular is finished loading, display it.
             this is because we run register for every annotation.
             e.g: View + Component will run once for view which is invalid but 2nd time as a valid combination.
             */
            console.warn("Annotation implementation for " + getTypeName(inst.cls) + " is invalid - component skipped.")
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