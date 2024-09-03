import { make_friends_list } from '@/utils/main';
import { AnatoloManager } from './anatolo';
import { AnatoloRef } from './ref';
import $ from 'jquery';
import { SiteStatic } from './site-static';

type RouterState = { url: string; body: string; title: string; scrollY?: number };

export class AnatoloRouter {
  routerStates = new Map<string, RouterState>();
  __animating = new AnatoloRef(false);
  __loading = new AnatoloRef(false);

  Anatolo;

  constructor(Anatolo: AnatoloManager) {
    this.Anatolo = Anatolo;
    window.history.scrollRestoration = 'manual';
    this.Anatolo.on('page-load', () => this.handlePage());
    window.addEventListener('DOMContentLoaded', () => {
      this.Anatolo.emit('page-load');
    });
    window.addEventListener('popstate', (ev) => this.onPopState(ev), false);
    this.makeLink();
  }

  isThisSite(url?: string) {
    if (!url) return false;
    url += '/';
    return url.startsWith(SiteStatic.root.href) || url.startsWith(SiteStatic.base);
  }

  scrollToHash(hash?: string) {
    if (hash == null) hash = window.location.hash;
    if (!hash) return; // Don't need
    const sid = decodeURI(hash).slice(1);
    const go = document.getElementById(sid);
    if (go) {
      window.scrollTo({
        left: 0,
        top: go.offsetTop + ((go.offsetParent as HTMLElement)?.offsetTop || 0) - 80,
        behavior: 'smooth',
      });
    }
  }

  set loading(status: boolean) {
    this.__loading.value = status;
    this.__animating.value = true;
    if (status === true) {
      $('.main.animated').removeClass('fadeInDown').addClass('fadeOutDown');
    }
    if (status === false) {
      $('.main.animated').addClass('fadeInDown').removeClass('fadeOutDown');
    }
    setTimeout(() => {
      this.__animating.value = false;
    }, 250);
  }

  get loading() {
    return this.__loading.value;
  }

  getRouterState() {
    return {
      url: document.location.href,
      body: document.getElementsByTagName('main-outlet')[0].innerHTML,
      title: document.title,
      scrollY: window.scrollY,
    };
  }

  cacheRouterState() {
    this.routerStates.set(document.location.href, this.getRouterState());
  }

  updateRouterState(state: RouterState) {
    const had = this.routerStates.has(state.url);
    if (had) {
      Object.assign(had, state);
    } else {
      this.routerStates.set(state.url, state);
    }
  }

  async queryPageData(link: string) {
    const cached = this.routerStates.get(link);
    if (cached) return cached;
    const res = await $.ajax(link);
    if (typeof res !== 'string') {
      throw {
        reason: 'NOT HTML',
        url: link,
      };
    }
    const body = res.match(/<main-outlet>([\s\S]*)<\/main-outlet>/)?.[1];
    if (!body) {
      throw {
        reason: 'NOT HTML',
        url: link,
      };
    }
    const head = res.match(/<head>([\s\S]*)<\/head>/)?.[1];
    let title = head?.match(/<title>([\s\S]*)<\/title>/)?.[1];
    title ??= document.title;
    return { url: link, body, title };
  }
  /**
   * Change Page
   */
  async replacePage({ body, title, url, scrollY }: RouterState, pushState = true) {
    const sidebarheight = document.getElementsByClassName('sidebar')[0].clientHeight - 40;
    this.cacheRouterState();

    await this.__animating.unitl(false);

    if (pushState) {
      history.pushState({ time: new Date(), url: url }, '', url);
    }

    $('main-outlet').html(body);
    document.title = title;

    this.updateRouterState({
      url: document.location.href,
      body,
      title,
    });
    this.handlePage();
    if (!scrollY) {
      if (window.innerWidth > 960) {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth',
        });
      } else {
        if (
          window.location.href === this.Anatolo.url_for('/') ||
          window.location.href.slice(0, -1) === this.Anatolo.url_for('/')
        ) {
          window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth',
          });
        } else {
          window.scrollTo({
            left: 0,
            top: sidebarheight,
          });
        }
      }
    } else {
      window.scrollTo({
        left: 0,
        top: scrollY,
      });
    }
  }

  async routeTo(link: string, pushState = true) {
    console.log(`Route to: ${link}`);
    if (!link) return;
    if (this.isThisSite(link)) {
      const url = new URL(link, window.location.origin);

      if (pushState && url.pathname === window.location.pathname) {
        console.log('scroll to hash');
        history.replaceState({ time: new Date() }, document.title, link);
        this.scrollToHash(url.hash);
        return;
      }

      try {
        this.loading = true;
        if (pushState) {
          this.cacheRouterState();
        }
        const res = await this.queryPageData(link);
        await this.replacePage(res, pushState);
        this.loading = false;
        this.Anatolo.emit('page-load');
      } catch (err: any) {
        if (err.status === 404) {
          window.location.href = err.url;
          return;
        }
        if (err?.reason === 'NOT HTML') {
          window.location.href = err.url;
          return;
        }
        console.error(err);
        alert(err);
        await this.replacePage(this.getRouterState(), false);
      }
    } else {
      window.location.href = link;
    }
  }
  makeLink() {
    document.addEventListener('click', (ev) => {
      let target = ev.target as HTMLAnchorElement;
      while (target) {
        if (target.onclick) return;
        if (this.isThisSite(target.href)) {
          ev.preventDefault();
          ev.stopPropagation();
          this.routeTo(target.href, true);
        }
        target = target.parentNode as HTMLAnchorElement;
      }
    });
  }

  handlePage() {
    this.scrollToHash();
    this.Anatolo.loadComment().catch(() => {});
    make_friends_list();
  }

  onPopState(event: PopStateEvent) {
    event.preventDefault();
    this.routeTo(window.location.href, false);
  }
}
