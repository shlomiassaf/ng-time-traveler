

import {IAdapter, RegisterInstruction} from "../adapterManager";
import {getTypeName} from "../../facade/lang";
import {BaseAdapter} from "./base";

export class ControllerAdapter extends BaseAdapter implements IAdapter{
    register() {
        this.inst.ngModule.controller(getTypeName(this.inst.cls), this.inst.cls);

    }
}

export {DirectiveAdapter, LinkingInstructionType} from "./directive";
export {NgRouteAdapter} from "./ngRoute";









