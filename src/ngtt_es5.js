import * as ngtt from './ngtt';
import { registerLegacy } from './ng/adapterManager';
ngtt['register'] = (cls) => registerLegacy(cls, cls.annotations);
window['ngtt'] = ngtt;
//# sourceMappingURL=ngtt_es5.js.map