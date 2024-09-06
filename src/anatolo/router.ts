import { make_friends_list } from '@/utils/main';
import { AnatoloRef } from './ref';
import { site } from './site';
import { loadScript } from '@/utils/load-script';

type PageCache = { url: string; body: string; title: string; scrollY?: number };

class NotHTMLError extends Error {
  url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
}

const pageChangeFns: (() => void)[] = [];
const pageCaches = new Map<string, PageCache>();
const animating = new AnatoloRef(false);
const loading = new AnatoloRef(false);

function initialize() {
  window.history.scrollRestoration = 'manual';
  window.addEventListener('DOMContentLoaded', () => {
    handlePage();
  });
  window.addEventListener(
    'popstate',
    (event) => {
      event.preventDefault();
      routeTo(window.location.href, false);
    },
    false,
  );
  makeLink();
}

function isThisSite(url?: string) {
  if (!url) return false;
  url += '/';
  return url.startsWith(site.root.href) || url.startsWith(site.base);
}

function scrollToHash(hash?: string) {
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

function getThisPageCache() {
  return {
    url: document.location.href,
    body: document.getElementsByTagName('main-outlet')[0].innerHTML,
    title: document.title,
    scrollY: window.scrollY,
  };
}

function cacheThisPage() {
  pageCaches.set(document.location.href, getThisPageCache());
}

function updatePageCache(state: PageCache) {
  const had = pageCaches.get(state.url);
  if (had) {
    Object.assign(had, state);
  } else {
    pageCaches.set(state.url, state);
  }
}

function showLoadingAnimation() {
  animating.value = true;
  setTimeout(() => {
    animating.value = false;
  }, 250);
}

async function withLoading(handler: () => Promise<void>) {
  loading.value = true;
  showLoadingAnimation();
  const mainEl = document.querySelector('.main.animated');
  mainEl?.classList.add('fadeOutDown');
  mainEl?.classList.remove('fadeInDown');

  await handler();

  const mainEl2 = document.querySelector('.main.animated');
  mainEl2?.classList.remove('fadeOutDown');
  mainEl2?.classList.add('fadeInDown');
  loading.value = false;
}

async function queryPageData(link: string) {
  const cached = pageCaches.get(link);
  if (cached) return cached;
  const res = await fetch(link).then((res) => res.text());
  if (typeof res !== 'string') {
    throw new NotHTMLError(link);
  }
  const body = res.match(/<main-outlet>([\s\S]*)<\/main-outlet>/)?.[1];
  if (!body) {
    throw new NotHTMLError(link);
  }
  const head = res.match(/<head>([\s\S]*)<\/head>/)?.[1];
  let title = head?.match(/<title>([\s\S]*)<\/title>/)?.[1];
  title ??= document.title;
  return { url: link, body, title };
}

function recoveryScrollY(scrollY?: number) {
  const sidebarheight = document.getElementsByClassName('sidebar')[0].clientHeight - 40;
  if (!scrollY) {
    if (window.innerWidth > 960) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
    } else {
      if (window.location.href === site.url_for('/') || window.location.href.slice(0, -1) === site.url_for('/')) {
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

/**
 * Change Page
 */
async function replacePageContent({ body, title, url, scrollY }: PageCache, pushState = true) {
  cacheThisPage();

  await animating.unitl(false);

  if (pushState) {
    history.pushState({ time: new Date(), url: url }, '', url);
  }

  document.querySelector('main-outlet')!.innerHTML = body;
  document.title = title;

  updatePageCache({
    url: document.location.href,
    body,
    title,
  });

  handlePage();

  recoveryScrollY(scrollY);
}

async function routeToNewPage(url: URL, pushState: boolean) {
  await withLoading(async () => {
    if (pushState) {
      cacheThisPage();
    }
    const res = await queryPageData(url.href);
    await replacePageContent(res, pushState);
  });
  handlePage();
}

function handlePage() {
  scrollToHash();
  reloadScript();
  pageChangeFns.forEach((fn) => {
    try {
      fn();
    } catch (error) {
      console.error(error);
    }
  });
}

function makeLink() {
  document.addEventListener('click', (ev) => {
    let target = ev.target as HTMLAnchorElement;
    while (target) {
      if (target.onclick) return;
      if (isThisSite(target.href)) {
        ev.preventDefault();
        ev.stopPropagation();
        routeTo(target.href, true);
      }
      target = target.parentNode as HTMLAnchorElement;
    }
  });
}

function onPageChange(fn: () => void) {
  pageChangeFns.push(fn);
}

function reloadScript() {
  const body_scripts = document.querySelector('main-outlet')?.getElementsByTagName('script');
  for (const script of body_scripts ?? []) {
    loadScript({
      url: script.src,
      script: script.textContent,
    });
  }
}

async function routeTo(link: string, pushState = true) {
  if (!link) return;
  if (isThisSite(link)) {
    const url = new URL(link, window.location.origin);
    if (pushState && url.pathname === window.location.pathname) {
      history.replaceState({ time: new Date() }, document.title, link);
      scrollToHash(url.hash);
    } else {
      routeToNewPage(url, pushState).catch((err: any) => {
        if (err.status === 404) {
          window.location.href = err.url;
          return;
        }
        if (err instanceof NotHTMLError) {
          window.location.href = err.url;
          return;
        }
        console.error(err);
        alert(err);
        replacePageContent(getThisPageCache(), false);
      });
    }
  } else {
    window.location.href = link;
  }
}

initialize();

export const router = {
  onPageChange,
  routeTo,
};

router.onPageChange(make_friends_list);
