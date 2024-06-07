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

  constructor() {
    super();
    this.base = $('#site_root_url').attr('data') ?? '/';
    this.root = new URL(this.base, window.location.origin);
  }
  init() {
    this.site = new AnatoloSite();
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
class AnatoloSite {
  base;
  root;
  __loaded = new AnatoloRef(false);
  constructor() {
    this.base = Anatolo.base;
    this.root = Anatolo.root;
    this.load();
    Anatolo.once('site-loaded', () => {
      this.__loaded.value = true;
    });
  }
  getUrl() {
    let path = window.location.pathname;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.slice(-1) !== '/') path += '/';
    path = decodeURI(path);
    return path;
  }
  async load() {
    this.__loaded.value = false;
    this.__data = await $.ajax(Anatolo.url_for('site.json'));
    this.__loaded.value = true;
    this.__urlmap = new Map();
    for (const key of ['pages', 'posts', 'tags', 'categories']) {
      for (const page of this.__data[key] ?? []) {
        page.prettyPath = page.path?.replaceAll('index.html', '') || '';
        this.__urlmap.set(page.prettyPath, page);
      }
    }
    Anatolo.emit('site-loaded');
  }
  async waitLoad() {
    await this.__loaded.unitl(true);
  }
  async thisPage() {
    await this.waitLoad();
    return this.__urlmap.get(this.getUrl());
  }
  async data() {
    await this.waitLoad();
    return this.__data;
  }
  reload() {
    this.__loaded = false;
    load();
  }
}

/** @type {import("eventemitter3").EventEmitter & AnatoloManager} */
const Anatolo = new AnatoloManager();
Anatolo.init();
