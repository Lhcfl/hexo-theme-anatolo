export const SiteStatic = {
  get base() {
    return document.getElementById('site_data_static')?.dataset.url ?? '/';
  },

  get root() {
    return new URL(this.base, window.location.origin);
  },

  url_for(url: string) {
    if (url[0] === '/') {
      url = url.slice(1);
    }
    return this.root + url;
  },
};
