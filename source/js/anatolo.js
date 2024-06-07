/// <reference path="./router.js" />
/// <reference types="@types/jquery" />
/// <reference path="./utils/index.js" />

class AnatoloManager extends EventEmitter3 {
  commentConfig;
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
    this.commentConfig = config;
    this.emit('comment-config-ok');
  }
  async getCommentConfig() {
    if (!this.commentConfig) await Anatolo.getMsg('comment-config-ok');
    return this.commentConfig;
  }
  /** @param {()=>void)} fn  */
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
}
class AnatoloSite {
  base;
  root;
  constructor() {
    this.base = Anatolo.base;
    this.root = Anatolo.root;
    this.load();
    Anatolo.once('site-loaded', () => {
      this.__loaded = true;
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
    this.__loaded = false;
    this.__data = await $.ajax(Anatolo.url_for('site.json'));
    this.__loaded = true;
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
    if (!this.__loaded) await Anatolo.getMsg('site-loaded');
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
