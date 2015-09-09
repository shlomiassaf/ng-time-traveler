import * as ngtt from './ngtt';

import {registerLegacy} from './ng/adapterManager';
ngtt['register'] = (cls) => registerLegacy(cls, cls.annotations);

window['ngtt'] = ngtt;

