import { AnatoloSearch } from '../components/search';
import * as comment from './comment';
import { darkLightToggle } from './dark-light-toggle';
import { site } from './site';

async function getPageTitle() {
  return (await site.thisPage())?.title ?? document.querySelector('title')?.textContent ?? '';
}

// Classes for interacting with elements in static HTML
export const Anatolo = {
  comment,
  site,
  search: new AnatoloSearch(),
  getPageTitle,
  share: {
    native: async () => {
      window.navigator.share({
        url: window.location.href,
        text: await getPageTitle(),
        title: await getPageTitle(),
      });
    },
  },
  darkLightToggle,
};
