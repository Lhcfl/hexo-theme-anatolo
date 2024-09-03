import { AnatoloManager } from './anatolo/anatolo';
import * as Utils from './utils/main';
import $ from 'jquery';

const Anatolo = new AnatoloManager();

(window as any).Anatolo = Anatolo;
(window as any).$ = $;
(window as any).Utils = Utils;

$.event.special.touchstart = {
  setup: function (_, ns, handle) {
    this.addEventListener('touchstart', handle as any, { passive: !ns.includes('noPreventDefault') });
  },
};
$.event.special.touchmove = {
  setup: function (_, ns, handle) {
    this.addEventListener('touchmove', handle as any, { passive: !ns.includes('noPreventDefault') });
  },
};
$.event.special.wheel = {
  setup: function (_, ns, handle) {
    this.addEventListener('wheel', handle as any, { passive: true });
  },
};
$.event.special.mousewheel = {
  setup: function (_, ns, handle) {
    this.addEventListener('mousewheel', handle as any, { passive: true });
  },
};
