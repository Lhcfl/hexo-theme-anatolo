/// <reference path="./router.js" />
/// <reference types="@types/jquery" />
/// <reference path="./utils/index.js" />

class AnatoloRef {
  _val;
  /** @type {Array<{fn: (val)=>void, time: number}>} */
  _watchers = [];
  constructor(val) {
    this._val = val;
  }
  get value() {
    return this._val;
  }
  set value(val) {
    this._val = val;
    for (const watcher of this._watchers) {
      watcher.fn();
      watcher.time--;
    }
    this._watchers = this._watchers.filter((w) => w.time > 0);
  }
  /** @param {(val)=>void} fn  */
  watch(fn, time = Infinity) {
    this._watchers.push({
      fn,
      time,
    });
  }
  watchOnce(fn) {
    this._watchers.push({
      fn,
      time: 1,
    });
  }
  async nextVal() {
    return new Promise((res) => {
      this.watchOnce(() => res(this.value));
    });
  }
  _checkin(vals) {
    for (const val of vals) {
      if (val == null && this._val == null) return true;
      if (this._val === val) return true;
    }
    return false;
  }
  /** until value in vals */
  async unitl(...vals) {
    while (!this._checkin(vals)) await this.nextVal();
    return this.value;
  }
  /** until value not in vals */
  async unitlNot(...vals) {
    while (this._checkin(vals)) await this.nextVal();
    return this.value;
  }
}

class AnatoloManager extends EventEmitter3 {
  commentConfig = new AnatoloRef(null);
  /** @type { AnatoloRouter } */
  router;
  loadComment = async () => {};
  /** @type { AnatoloSite } */
  site;
  /** @type { Record<string, any> } */
  state = {};

  constructor() {
    super();
    this.base = $('#site_root_url').attr('data') ?? '/';
    this.root = new URL(this.base, window.location.origin);
  }
  async getMsg(ev) {
    return new Promise((res) => {
      this.once(ev, res);
    });
  }
  /** @returns {Promise<string>} */
  async getPageTitle() {
    return (await this.site.thisPage())?.title ?? document.querySelector('title').textContent;
  }
  setCommentConfig(config) {
    this.commentConfig.value = config;
  }
  async getCommentConfig() {
    return await this.commentConfig.unitlNot(null);
  }
  /** @param {()=>void} fn  */
  nextTick(fn) {
    setTimeout(fn, 0);
  }
  url_for(url, with_origin) {
    let root = Anatolo.root;
    if (with_origin) {
      root = window.location.origin + root;
    }
    if (url[0] !== '/') {
      url = '/' + url;
    }
    if (root[root.length - 1] == '/') {
      return root.slice(0, -1) + url;
    } else {
      return root + url;
    }
  }
  ref(val) {
    return new AnatoloRef(val);
  }
}

/** @template T */
class AnatoloDynamicContent {
  __loaded = new AnatoloRef(false);
  /** @type {T} */
  __data;
  /**
   * @param {Promise<T> | string} src
   * @param {(data)=>T} transform
   */
  constructor(src, transform = (x) => x) {
    if (typeof src === 'string') {
      src = $.ajax(Anatolo.url_for(src));
    }
    src.then((res) => {
      this.__loaded.value = true;
      this.__data = transform(res);
    });
  }
  async untilLoaded() {
    await this.__loaded.unitl(true);
  }
  async data() {
    await this.untilLoaded();
    return this.__data;
  }
}
class AnatoloSite {
  base;
  root;
  __urlmap = new Map();
  __data = new AnatoloDynamicContent('site.json');
  constructor() {
    this.base = Anatolo.base;
    this.root = Anatolo.root;
    this.convert();
  }
  getUrl() {
    let path = window.location.pathname;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.slice(-1) !== '/') path += '/';
    path = decodeURI(path);
    return path;
  }
  async convert() {
    const data = await this.data();
    for (const key of ['pages', 'posts', 'tags', 'categories']) {
      for (const page of data[key] ?? []) {
        page.prettyPath = page.path?.replaceAll('index.html', '') || '';
        this.__urlmap.set(page.prettyPath, page);
      }
    }
  }
  async thisPage() {
    await this.data();
    return this.__urlmap.get(this.getUrl());
  }
  data() {
    return this.__data.data();
  }
}

/** @type {import("eventemitter3").EventEmitter & AnatoloManager} */
const Anatolo = new AnatoloManager();
Anatolo.site = new AnatoloSite();

jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    this.addEventListener('touchstart', handle, { passive: !ns.includes('noPreventDefault') });
  },
};
jQuery.event.special.touchmove = {
  setup: function (_, ns, handle) {
    this.addEventListener('touchmove', handle, { passive: !ns.includes('noPreventDefault') });
  },
};
jQuery.event.special.wheel = {
  setup: function (_, ns, handle) {
    this.addEventListener('wheel', handle, { passive: true });
  },
};
jQuery.event.special.mousewheel = {
  setup: function (_, ns, handle) {
    this.addEventListener('mousewheel', handle, { passive: true });
  },
};
