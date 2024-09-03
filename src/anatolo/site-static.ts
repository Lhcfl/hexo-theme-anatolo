export class AnatoloSiteStatic {
  readonly base;
  readonly root;

  constructor() {
    this.base = document.getElementById('site_data_static')?.dataset.url ?? '/';
    this.root = new URL(this.base, window.location.origin);
  }

  url_for(url: string) {
    if (url[0] === '/') {
      url = url.slice(1);
    }
    return this.root + url;
  }
}

export const SiteStatic = new AnatoloSiteStatic();
