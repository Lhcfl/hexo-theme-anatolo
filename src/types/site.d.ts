type DateString = string;

interface BaseLinkable {
  _id: string;
  path: string;
  permalink: string;
}

interface BasePage extends BaseLinkable {
  date: DateString;
  excerpt: string;
  title: string;
  updated: DateString;
}

export interface Page extends BasePage {
  layout: 'page';
}

export interface Post extends BasePage {
  layout: 'post';
  photos: [];
  slug: string;
  __post: true;
}

interface Collection extends BaseLinkable {
  length: number;
  slug: string;
  posts: Post[];
  title: never;
}

export interface Tag extends Collection {}
export interface Category extends Collection {}

export interface Site {
  pages: Page[];
  posts: Post[];
  tags: Tag[];
  categories: Category[];
}

export type WebPage = Page | Post | Tag | Category;
