import { Site, WebPage } from '../types/site';
import EventEmitter3 from 'eventemitter3';
import { AnatoloRef } from './ref';
import { AnatoloSite } from './site';
import { AnatoloSearch } from './search';
import { AnatoloRouter } from './router';
import $ from 'jquery';
import { loadComment } from './load-comment';
import { darkLightToggle } from './dark-light-toggle';

export class AnatoloManager extends EventEmitter3 {
  commentConfig = new AnatoloRef<any>(null);
  router = new AnatoloRouter(this);
  loadComment = loadComment;
  site = new AnatoloSite();
  state: Record<string, any> = {};
  search = new AnatoloSearch(this);

  get base() {
    return this.site.base;
  }
  get root() {
    return this.site.root;
  }

  constructor() {
    super();
  }
  async getMsg(ev: string) {
    return new Promise((res) => {
      this.once(ev, res);
    });
  }
  /** @returns {Promise<string>} */
  async getPageTitle() {
    return (await this.site.thisPage()).title ?? document.querySelector('title')?.textContent;
  }
  setCommentConfig(config: any) {
    this.commentConfig.value = config;
  }
  async getCommentConfig() {
    return await this.commentConfig.unitlNot(null);
  }
  nextTick(fn: () => void) {
    setTimeout(fn, 0);
  }
  url_for(url: string) {
    if (url[0] === '/') {
      url = url.slice(1);
    }
    return this.root + url;
  }
  success() {
    return new Promise<void>((res) => {
      $('#success-indicator').addClass('show');
      setTimeout(() => {
        $('#success-indicator').addClass('animated fadeOut');
      }, 500);
      setTimeout(() => {
        $('#success-indicator').removeClass('show animated fadeOut');
        res();
      }, 1000);
    });
  }

  share = {
    native: async () => {
      window.navigator.share({
        url: window.location.href,
        text: await this.getPageTitle(),
        title: await this.getPageTitle(),
      });
    },
  };

  darkLightToggle = darkLightToggle;
}
