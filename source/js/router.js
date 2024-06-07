/// <reference path="./anatolo.js" />

class AnatoloRouter {
  /** @typedef {{url: string, body: string, title: string, scrollY?: number}} RouterState  */
  /** @type {Map<string, RouterState | undefined>} */
  routerStates = new Map();
  constructor() {
    window.history.scrollRestoration = 'manual';
    Anatolo.on('page-load', () => this.handlePage());
    window.addEventListener('DOMContentLoaded', () => {
      Anatolo.emit('page-load');
    });
    window.addEventListener('popstate', (ev) => this.onPopState(ev), false);
    this.makeLink();
  }
  isThisSite(url) {
    if (!url) return false;
    url += '/';
    return url.startsWith(Anatolo.root.href) || url.startsWith(Anatolo.base);
  }
  /** @param {string | null} hash  */
  scrollToHash(hash = null) {
    if (hash == null) hash = window.location.hash;
    if (!hash) return; // Don't need
    const sid = decodeURI(hash).slice(1);
    const go = document.getElementById(sid);
    if (go) {
      window.scrollTo({
        left: 0,
        top: go.offsetTop + (go.offsetParent?.offsetTop || 0) - 80,
        behavior: 'smooth',
      });
    }
  }
  /** @param {boolean} status  */
  set loading(status) {
    this.__loading = status;
    if (status === true) {
      $('.main.animated').removeClass('fadeInDown').addClass('fadeOutDown');
      Anatolo.emit('start-fadeout');
      setTimeout(() => {
        Anatolo.emit('end-fadeout');
      }, 250);
    }
    if (status === false) {
      $('.main.animated').addClass('fadeInDown').removeClass('fadeOutDown');
      Anatolo.emit('start-fadein');
      setTimeout(() => {
        Anatolo.emit('end-fadein');
      }, 250);
    }
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
  /** @param {RouterState} state  */
  updateRouterState(state) {
    const had = this.routerStates.has(state.url);
    if (had) {
      Object.assign(had, state);
    } else {
      this.routerStates.set(state.url, state);
    }
  }
  /** @param {string} link  */
  async queryPageData(link) {
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
   * @param {RouterState} _1
   * @param {boolean} pushState
   */
  async replacePage({ body, title, url, scrollY }, pushState = true) {
    const sidebarheight = document.getElementsByClassName('sidebar')[0].clientHeight - 40;
    this.cacheRouterState();

    await Anatolo.getMsg('end-fadeout');

    $('main-outlet').html(body);
    document.title = title;

    if (pushState) {
      history.pushState({ time: new Date() }, title, url);
    }

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
          window.location.href === Anatolo.url_for('/', true) ||
          window.location.href.slice(0, -1) === Anatolo.url_for('/', true)
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
  /** @param {string} link */
  async routeTo(link, pushState = true) {
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
        this.scrollToHash(url.hash);
      } catch (err) {
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
      let target = ev.target;
      while (target) {
        if (target.onclick) return;
        if (this.isThisSite(target.href)) {
          ev.preventDefault();
          ev.stopPropagation();
          this.routeTo(target.href, true);
        }
        target = target.parentNode;
      }
    });
  }

  handlePage() {
    Anatolo.loadComment().catch(() => {});
    Utils.make_friends_list();
  }

  onPopState(event) {
    event.preventDefault();
    this.routeTo(window.location.href, false);
  }
}

Anatolo.router = new AnatoloRouter();
