import { AnatoloManager } from './anatolo/anatolo';
import * as Utils from './utils/main';

const Anatolo = new AnatoloManager();

(window as any).Anatolo = Anatolo;
(window as any).Utils = Utils;

import FloatBtn from './components/float-btn';
FloatBtn();
