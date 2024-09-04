type Attrs = Record<string, any> | null;

type ContentNode = string | HTMLElement | null | undefined;

type Content = ContentNode | ContentNode[];

export function h(ident: string, attrs: Attrs, ...content: ContentNode[]) {
  let [tagName, ...classes] = ident.split('.');
  if (!tagName) tagName = 'div';
  const elem = document.createElement(tagName);
  elem.classList.add(...classes);
  if (attrs != null) {
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'class' && attrs.class) {
        elem.classList.add(...attrs.class.split(' '));
      } else if (key.startsWith('on')) {
        elem.addEventListener(key.slice(2), val);
      } else {
        elem.setAttribute(key, val);
      }
    }
  }

  function addContent(c: Content) {
    if (typeof c === 'string') {
      elem.innerHTML += c;
    } else if (c instanceof Element) {
      elem.appendChild(c);
    }
  }

  content.flat().forEach((c) => {
    addContent(c);
  });

  return elem;
}
