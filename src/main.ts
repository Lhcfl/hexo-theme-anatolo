import { Anatolo } from './anatolo/anatolo';
import * as Utils from './utils/main';
import FloatBtn from './components/float-btn';

(window as any).Anatolo = Anatolo;
(window as any).Utils = Utils;

new FloatBtn();
