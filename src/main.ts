import './scss/color-defination.scss';
import './scss/blog_basic.scss';
import './scss/highlight.scss';
import './scss/style.scss';

import { Anatolo } from './anatolo/anatolo';
import * as Utils from './utils/main';
import FloatBtn from './components/float-btn';
import './components/rightbtn';

(window as any).Anatolo = Anatolo;
(window as any).Utils = Utils;

new FloatBtn();
