import Fuse from 'fuse.js';
import { AnatoloDynamicResource } from '@/anatolo/dynamic-resource';
import { AnatoloRef } from '@/anatolo/ref';
import { escapeHTML, h, nextTick } from '@/utils/main';
import { Component } from './base';
import { router } from '@/anatolo/router';

interface SearchResourcePage {
  title: string;
  text: string;
  link: string;
}

interface SearchResourceCollection {
  name: string;
  slug: string;
  link: string;
}

interface SearchResource {
  pages: SearchResourcePage[];
  posts: SearchResourcePage[];
  tags: SearchResourceCollection[];
  categories: SearchResourceCollection[];
}

export class AnatoloSearch extends Component {
  searchData: AnatoloDynamicResource<SearchResource>;
  config: Record<string, any> = {};
  showing = false;

  get mainEl() {
    return document.querySelector('.ins-search') as HTMLElement;
  }
  get inputEl() {
    return this.mainEl?.querySelector('.ins-search-input') as HTMLInputElement;
  }
  get wrapperEl() {
    return this.mainEl?.querySelector('.ins-section-wrapper') as HTMLElement;
  }
  get containerEl() {
    return this.mainEl?.querySelector('.ins-section-container') as HTMLElement;
  }

  fuses = {};
  fuse_ok = new AnatoloRef(false);

  constructor() {
    super();
    this.searchData = new AnatoloDynamicResource('content.json');
  }

  init() {
    this.buildFuse();

    document.body.appendChild(this.mainEl);

    this.inputEl.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowDown':
          this.markActive(this.getSelectedIndex() + 1);
          break;
        case 'ArrowUp':
          this.markActive(this.getSelectedIndex() - 1);
          break;
        case 'Enter':
          const url = (document.querySelector('.ins-selectable.active') as HTMLElement)?.dataset.url;
          if (url) this.gotoLink(url);
          break;
        case 'Escape':
          this.closeWindow();
          break;
      }
    });
    this.inputEl.addEventListener('input', () => {
      nextTick(() => {
        this.search();
      });
    });

    document.addEventListener('keydown', (e) => {
      const focused = document.querySelector(':focus');
      if (focused?.tagName === 'TEXTAREA' || focused?.tagName === 'INPUT') {
        return;
      }
      if (this.showing) {
        return;
      }
      if (e.key === 's') {
        nextTick(() => this.openWindow());
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target !== this.inputEl && this.showing) {
        this.closeWindow();
      }
    });
  }

  getSelectedIndex() {
    let index = -1;
    document.querySelectorAll('.ins-selectable').forEach((elem, id) => {
      if (elem.classList.contains('active')) index = id;
    });
    return index;
  }

  markActive(index: number) {
    const items = document.querySelectorAll('.ins-selectable');
    index = (index + Number(index == -2) + items.length) % items.length;

    items.forEach((elem, id) => {
      elem.classList.remove('active');
      if (id === index) {
        elem.classList.add('active');
      }
    });
  }

  gotoLink(url: string) {
    router.routeTo(url);
    this.closeWindow();
  }

  makeSearchItem(icon: string | null, title: string | null, slug: string | null, preview: string | null, url: string) {
    return h(
      '.ins-selectable.ins-search-item',
      {
        data: { url },
        event: {
          click: (e) => {
            this.gotoLink(url);
          },
        },
      },
      [
        h('header', [
          h(`i.fa.fa-${icon}`),
          h('span.ins-title', title != null && title !== '' ? title : this.config.translation['untitled']),
          slug ? h('span.ins-slug', slug) : null,
        ]),
        preview ? h('p.ins-search-preview', preview) : null,
      ],
    );
  }

  makeSection(sectionType: any, array: Array) {
    const sectionTitle = this.config.translation[sectionType] as string;
    let searchItems;
    if (array.length === 0) return null;

    searchItems = array.map((item) => {
      const newItem: Record<string, any> = {};
      for (const key of Object.keys(item)) {
        if (key === 'link') {
          newItem[key] = item[key];
          continue;
        }
        newItem[key] = escapeHTML(item[key]);
      }
      for (const matched of item.matches ?? []) {
        if (matched.key === 'link') continue;

        const [st, ed] = matched.indices.reduce((a, b) => (a[1] - a[0] < b[1] - b[0] ? b : a), [0, -1]);

        newItem[matched.key] =
          escapeHTML(item[matched.key].slice(0, st)) +
          '<mark>' +
          escapeHTML(item[matched.key].slice(st, ed + 1)) +
          '</mark>' +
          escapeHTML(item[matched.key].slice(ed + 1));
        if (matched.key === 'text') {
          newItem.text = newItem.text.slice(Math.max(st - 20, 0));
        }
      }

      if (['posts', 'pages'].includes(sectionType)) {
        return this.makeSearchItem('file', newItem.title, null, newItem.text.slice(0, 150), newItem.link);
      }
      if (['categories', 'tags'].includes(sectionType)) {
        return this.makeSearchItem(
          sectionType === 'CATEGORIES' ? 'folder' : 'tag',
          newItem.name,
          newItem.slug,
          null,
          newItem.link,
        );
      }
      return null;
    });

    return h('section.ins-section', [h('header.ins-section-header', sectionTitle), searchItems]);
  }

  async buildFuse() {
    const data = await this.searchData.data();
    Fuse.config.ignoreLocation = true;
    Fuse.config.includeMatches = true;
    for (const key of ['posts', 'pages']) {
      const conf = {
        keys: ['title', 'text', 'link'],
      };
      this.fuses[key] = new Fuse(data[key], conf);
    }
    for (const key of ['tags', 'categories']) {
      const conf = {
        keys: ['title', 'text', 'link'],
      };
      this.fuses[key] = new Fuse(data[key], conf);
    }
    this.fuse_ok.value = true;
  }

  async getSearchResult(keyword: string) {
    await this.fuse_ok.unitl(true);
    const data = await this.searchData.data();
    return Object.fromEntries(
      ['posts', 'pages', 'categories', 'tags'].map((t) => [
        t,
        keyword ? this.fuses[t].search(keyword, { limit: 5 }).map((i) => ({ ...i, ...i.item })) : data[t].slice(0, 5),
      ]),
    );
  }

  search() {
    const keyword = this.inputEl.value;
    this.getSearchResult(keyword).then((res) => {
      this.searchResultToDOM(res);
    });
  }

  searchResultToDOM(searchResult) {
    this.containerEl.innerHTML = '';
    for (var key in searchResult) {
      const section = this.makeSection(key.toLowerCase(), searchResult[key]);
      if (section) this.containerEl.appendChild(section);
    }
  }

  selectItemByDiff(value: number) {
    const items = this.containerEl.querySelectorAll('.ins-selectable');
    let prevPosition = -1;
    items.forEach((elem, index) => {
      if (elem.classList.contains('active')) {
        elem.classList.remove('active');
        prevPosition = index;
        return;
      }
    });
    let nextPosition = (items.length + prevPosition + value) % items.length;
    items[nextPosition].classList.add('active');
    // scrollTo(items[nextPosition].scrollTop);
  }

  openWindow() {
    this.mainEl.classList.add('animated', 'fadeIn', 'show');
    this.mainEl.classList.remove('fadeOut');
    this.inputEl.focus();
    nextTick(() => {
      this.inputEl.setSelectionRange(0, this.inputEl.value.length);
      this.showing = true;
    });
    this.search();
  }

  closeWindow() {
    if (!this.showing) return;
    this.mainEl.classList.add('fadeOut');
    this.mainEl.classList.remove('fadeIn');
    this.inputEl.blur();
    this.showing = false;
    setTimeout(() => {
      this.mainEl.classList.remove('show');
    }, 400);
  }
}
