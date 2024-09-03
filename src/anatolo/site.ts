import type { Site, WebPage } from '@/types/site';
import { AnatoloSiteStatic } from './site-static';
import { AnatoloDynamicResource } from './dynamic-resource';

export class AnatoloSite extends AnatoloSiteStatic {
  private urlMap = new Map<string, WebPage>();
  private siteData = new AnatoloDynamicResource<Site>('site.json');

  constructor() {
    super();
    this.siteData.data().then((data) => {
      for (const key of ['pages', 'posts', 'tags', 'categories'] as const) {
        for (const page of data[key] ?? []) {
          const prettyPath = page.path?.replaceAll('index.html', '') || '';
          this.urlMap.set(prettyPath, page);
        }
      }
    });
  }

  data() {
    return this.siteData.data();
  }

  thisPageUrl() {
    let path = window.location.pathname;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.slice(-1) !== '/') path += '/';
    path = decodeURI(path);
    return path;
  }

  async thisPage() {
    await this.data();
    return this.urlMap.get(this.thisPageUrl()) as WebPage;
  }

  url_for(url: string) {
    if (url[0] === '/') {
      url = url.slice(1);
    }
    return this.root + url;
  }
}
