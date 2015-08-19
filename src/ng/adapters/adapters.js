import { getTypeName } from "../../ng/util";
import { BaseAdapter } from "./base";
export class ControllerAdapter extends BaseAdapter {
    register() {
        this.inst.ngModule.controller(getTypeName(this.inst.cls), this.inst.cls);
    }
}
export { DirectiveAdapter, LinkingInstructionType } from "./directive";
export { NgRouteAdapter } from "./ngRoute";
//# sourceMappingURL=adapters.js.map