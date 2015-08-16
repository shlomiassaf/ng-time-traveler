/// <reference path="../../../typings/tsd.d.ts" />

import {RegisterInstruction} from "../adapterManager";

export class BaseAdapter  {
    constructor(public inst: RegisterInstruction) {
    }
}