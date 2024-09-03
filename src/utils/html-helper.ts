type Attrs = {
  data?: Record<string, string>;
  event?: Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;
  class?: string;
} & Record<string, any>;

type ContentNode = string | HTMLElement | null | undefined;

type Content = ContentNode | ContentNode[];

function h3(ident: string, attrs: Attrs, content?: Content) {
  let [tagName, ...classes] = ident.split('.');
  if (!tagName) tagName = 'div';
  const elem = document.createElement(tagName);
  elem.classList.add(...classes);
  for (const key of Object.keys(attrs)) {
    if (key === 'class' && attrs.class) {
      elem.classList.add(...attrs.class.split(' '));
    } else if (key === 'data') {
      for (const [dataKey, dataVal] of Object.entries(attrs.data || {})) {
        elem.dataset[dataKey] = dataVal as string;
      }
    } else if (key === 'event') {
      for (const [eventName, fn] of Object.entries(attrs.event || {})) {
        elem.addEventListener(eventName, fn);
      }
    } else {
      elem.setAttribute(key, attrs[key]);
    }
  }

  function addContent(c: Content) {
    if (typeof c === 'string') {
      elem.innerHTML += c;
    } else if (c instanceof Element) {
      elem.appendChild(c);
    }
  }

  if (Array.isArray(content)) {
    content.flat().forEach((c) => {
      addContent(c);
    });
  } else {
    addContent(content);
  }

  return elem;
}

export function h(ident: string, content?: Content): HTMLElement;
export function h(ident: string, attrs: Attrs, content?: Content): HTMLElement;

export function h(ident: string, attrs_or_content?: Attrs | Content, content?: Content) {
  if (Array.isArray(attrs_or_content) || typeof attrs_or_content === 'string' || attrs_or_content == null) {
    return h3(ident, {}, attrs_or_content);
  } else {
    return h3(ident, attrs_or_content, content);
  }
}
