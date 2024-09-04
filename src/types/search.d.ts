export interface SearchResourcePage {
  title: string;
  text: string;
  link: string;
}

export interface SearchResourceCollection {
  name: string;
  slug: string;
  link: string;
}

export interface SearchResource {
  pages: SearchResourcePage[];
  posts: SearchResourcePage[];
  tags: SearchResourceCollection[];
  categories: SearchResourceCollection[];
}
