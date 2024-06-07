/// <reference path="./utils/url_for.js" />
/// <reference path="./router.js" />
/// <reference types="@types/jquery" />

class AnatoloManager extends EventEmitter3 {
  site;
  commentConfig;
  /** @type { AnatoloRouter } */
  router;
  loadComment = async () => {};

  constructor() {
    super();
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
}
class AnatoloSite {
  constructor() {
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
    this.__data = await $.ajax(url_for('site.json'));
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
