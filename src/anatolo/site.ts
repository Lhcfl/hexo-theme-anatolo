import type { Site, WebPage } from '@/types/site';
import { AnatoloDynamicResource } from './dynamic-resource';
import { SiteStatic } from './site-static';

const urlMap = new Map<string, WebPage>();
const siteData = new AnatoloDynamicResource<Site>('site.json');

siteData.data().then((data) => {
  for (const key of ['pages', 'posts', 'tags', 'categories'] as const) {
    for (const page of data[key] ?? []) {
      const prettyPath = page.path?.replaceAll('index.html', '') || '';
      urlMap.set(prettyPath, page);
    }
  }
});

export const site = {
  ...SiteStatic,

  data() {
    return siteData.data();
  },

  thisPageUrl() {
    let path = window.location.pathname;
    if (path.startsWith('/')) path = path.slice(1);
    if (path.slice(-1) !== '/') path += '/';
    path = decodeURI(path);
    return path;
  },

  async thisPage() {
    await site.data();
    return urlMap.get(site.thisPageUrl());
  },
};
