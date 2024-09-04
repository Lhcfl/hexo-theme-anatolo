import { Anatolo } from './anatolo/anatolo';
import * as Utils from './utils/main';

(window as any).Anatolo = Anatolo;
(window as any).Utils = Utils;

import FloatBtn from './components/float-btn';
new FloatBtn();
