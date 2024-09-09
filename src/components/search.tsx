import './search.scss';
import Fuse, { type FuseResult } from 'fuse.js';
import { AnatoloDynamicResource } from '@/anatolo/dynamic-resource';
import { AnatoloRef } from '@/anatolo/ref';
import { escapeHTML, nextTick } from '@/utils/main';
import { Component } from './base';
import { router } from '@/anatolo/router';
import { SearchResourceCollection, SearchResource, SearchResourcePage } from '@/types/search';
import { h } from '@/utils/main';

const SEARCH_RESULT_LIMIT = 5;

const SEARCHABLE = ['posts', 'pages', 'tags', 'categories'] as const;

type SEARCHABLE_T = 'posts' | 'pages' | 'tags' | 'categories';

type SearchResult =
  | (FuseResult<SearchResourceCollection> | SearchResourceCollection)[]
  | (FuseResult<SearchResourcePage> | SearchResourcePage)[];

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

  fuses: {
    pages?: Fuse<SearchResourcePage>;
    posts?: Fuse<SearchResourcePage>;
    tags?: Fuse<SearchResourceCollection>;
    categories?: Fuse<SearchResourceCollection>;
  } = {};

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
    return (
      <div
        class="ins-selectable ins-search-item"
        data-url={url}
        onclick={() => {
          this.gotoLink(url);
        }}
      >
        <header>
          <i class={`fa fa-${icon}`}></i>
          <span class="ins-title">{title != null && title !== '' ? title : this.config.translation['untitled']}</span>
          {slug && slug !== title ? <span class="ins-slug">{slug}</span> : null}
        </header>
        {preview ? <p class="ins-search-preview">{preview}</p> : null}
      </div>
    );
  }

  makeSection(sectionType: SEARCHABLE_T, array: SearchResult) {
    const sectionTitle = this.config.translation[sectionType] as string;
    let searchItems;
    if (array.length === 0) return null;

    searchItems = array.map((item) => {
      const newItem: Record<string, any> = {};

      for (const [key, val] of Object.entries(item)) {
        if (key === 'link') {
          newItem[key] = val;
          continue;
        }
        newItem[key] = escapeHTML(val);
      }

      const matches = ('matches' in item ? item.matches : null) ?? [];

      for (const matched of matches) {
        if (matched.key === 'link') continue;
        if (matched.key == null) continue;

        const [st, ed] = matched.indices.reduce((a, b) => (a[1] - a[0] < b[1] - b[0] ? b : a), [0, -1]);

        newItem[matched.key] =
          escapeHTML((item as unknown as Record<string, string>)[matched.key].slice(0, st)) +
          '<mark>' +
          escapeHTML((item as unknown as Record<string, string>)[matched.key].slice(st, ed + 1)) +
          '</mark>' +
          escapeHTML((item as unknown as Record<string, string>)[matched.key].slice(ed + 1));
        if (matched.key === 'text') {
          newItem.text = newItem.text.slice(Math.max(st - 20, 0));
        }
      }

      if (['posts', 'pages'].includes(sectionType)) {
        return this.makeSearchItem('file', newItem.title, null, newItem.text.slice(0, 150), newItem.link);
      }
      if (['categories', 'tags'].includes(sectionType)) {
        return this.makeSearchItem(
          sectionType === 'categories' ? 'folder' : 'tag',
          newItem.name,
          newItem.slug,
          null,
          newItem.link,
        );
      }
      return null;
    });

    return (
      <section class="ins-section">
        <header class="ins-section-header">{sectionTitle}</header>
        {searchItems}
      </section>
    );
  }

  async buildFuse() {
    const data = await this.searchData.data();
    Fuse.config.ignoreLocation = true;
    Fuse.config.includeMatches = true;

    this.fuses.posts = new Fuse(data.posts, {
      keys: ['title', 'text', 'link'],
    });
    this.fuses.pages = new Fuse(data.pages, {
      keys: ['title', 'text', 'link'],
    });
    this.fuses.tags = new Fuse(data.tags, { keys: ['name', 'slug', 'link'] });
    this.fuses.categories = new Fuse(data.categories, {
      keys: ['name', 'slug', 'link'],
    });

    this.fuse_ok.value = true;
  }

  async getSearchResult(keyword: string) {
    await this.fuse_ok.unitl(true);
    const data = await this.searchData.data();

    const searched = <T extends keyof SearchResource>(t: T) => {
      return keyword
        ? this.fuses[t]!.search(keyword, { limit: SEARCH_RESULT_LIMIT }).map((res) => ({ ...res, ...res.item }))
        : data[t].slice(0, 5);
    };

    return SEARCHABLE.map((s) => [s, searched(s)] as [SEARCHABLE_T, SearchResult]);
  }

  search() {
    const keyword = this.inputEl.value;
    this.getSearchResult(keyword).then((res) => {
      this.containerEl.innerHTML = '';
      for (const [key, result] of res) {
        const section = this.makeSection(key, result);
        if (section) this.containerEl.appendChild(section);
      }
    });
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
